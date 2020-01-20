const nodemailer = require('nodemailer');
const properties = require('./properties.js');
const defMail = require('./defaultMail.js');
const express = require('express');
const moment = require('moment');

const mailProps = new properties.MailProperties();
const defaultMail = new defMail.DefaultMail();
const deployed = true;

const username = mailProps.username;
const password = mailProps.password;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: username,
        pass: password
    }
});

let sendMail = mail => {
    transporter.sendMail(mail).then((error, info) => {
        if (error) {
            console.error(error);
            return false;
        } else {
            console.log(info.response);
            return true;
        }
    });
};

addMailEndpoints = (app, db) => {
    /**
     * Mail midpoint sets relevant attributes for building the mails
     * body:
     * {
     *     username: string
     *     text: string
     *     email: string
     *     subject: string
     * }
     */
    app.use("/mail", (req, res, next) => {
        console.log("Mail request received");
        if (deployed) {
            defaultMail.user = req.body.username;
            defaultMail.date = moment().format('YYYY-MM-DD');
            defaultMail.text = req.body.text;
            defaultMail.subject = req.body.subject;
            defaultMail.email = req.body.email;
            req.body.mailToDev = {
                from: req.body.email,
                to: username,
                subject: defaultMail.subject,
                text: defaultMail.text
            };
            req.body.mailToUser = {
                from: username,
                to: req.body.email,
                subject: defaultMail.subject,
                text: defaultMail.text
            };
            next();
        } else {
            res.sendStatus(503);
        }
    });

    /**
     * Endpoint for sending a bug report
     */
    app.post("/mail/bug", (req, res) => {
        console.log("POST-request received - /mail/bug");
        req.body.mailToDev.subject = `Feilrapport: ${req.body.mailToDev.subject}`;
        req.body.mailToDev.text = `Feilrapport fra ${defaultMail.user}, mailadresse: ${defaultMail.email}\n\n${defaultMail.text}`;

        req.body.mailToUser.subject = `RE: Feilrapport: ${req.body.mailToUser.subject}`;
        req.body.mailToUser.text = defaultMail.bugText;

        return Promise.allSettled([
            sendMail(req.body.mailToDev),
            sendMail(req.body.mailToUser),
            db.createBug(req.body)
            /*.then(response => {
                return new Promise((resolve, reject) => resolve("Bug reported in database"));
            })
            .catch(error => {
                console.log(error);
                return new Promise((resolve, reject) => reject(error));
            })*/]
        )
            .then(results => {
                results.forEach(res => {
                    if (res.status == 'fulfilled') {
                        console.log(res.value);
                    } else if (res.status == 'rejected') {
                        console.log(res.reason);
                    } else {
                        console.log(res);
                    }
                });
                res.sendStatus(200);
            });
    });

    app.post("/mail/password", (req, res) => {
        console.log("POST-request received - /mail/password");

        req.body.mailToUser.subject = `Glemt passord: ${req.body.email}`;

        return db.forgotPassword(req.body.email)
            .then(response => {
                if (response) {
                    defaultMail.password = response;
                    req.body.mailToUser.text = defaultMail.passwordText;
                    sendMail(req.body.mailToUser);
                    res.sendStatus(201);
                } else {
                    throw new Error("No new password received from dao");
                }
            })
            .catch(error => {
                console.error(error);
                res.sendStatus(500);
            });

    });
};

module.exports = {addMailEndpoints};