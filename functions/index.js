Object.defineProperty(exports, "__esModule", {value: true});
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const model = require('./model.js');
model.syncModels();
const sequelize = require("sequelize");
const op = sequelize.Op;
const jwt = require("jsonwebtoken");
const hashPassword = require("./userhandling");
let cors = require("cors");

let privateKey = (publicKey = "shhhhhverysecret");

admin.initializeApp(functions.config().firebase);
const app = express();
app.use(cors({origin: true}));

const main = express();
main.use('/api/v1', app);
main.use(bodyParser.json());
exports.webApi = functions.https.onRequest(main);
const deployed = true;

function loginOk(email, password) {
    return model.UserModel.findAll({where: {[op.and]: [{email: email}, {password: password}]}})
        .then(response => {
            return response.length === 1; // TODO use bcrypt.compare()
        });
}

app.get("/test", (req, res) => {
    console.log(req);
    res.send("test functional");
});

app.get("/events", (req, res) => {
    console.log("GET-request received from client");
    return model.EventModel.findAll({order: [['dateTime', 'ASC']]})
        .then(events => res.send(events))
        .catch(error => console.error(error));
});

app.get("/events/search/:searchText", (req, res) => {
    console.log("GET-request received from client");
    return model.EventModel.findAll({
        where: {[op.or]: [{eventName: {[op.like]: `%${req.params.searchText}%`}}, {description: {[op.like]: `%${req.params.searchText}%`}}]},
        order: [['dateTime', 'ASC']]
    })
        .then(events => res.send(events))
        .catch(error => console.error(error));
});

app.post("/user", (req, res) => {
    console.log("POST-request received from client");
    hashPassword.hashPassword(req.body.password)
        .then(credentials => {
            return model.UserModel.create({
                username: req.body.username,
                email: req.body.email,
                password: credentials[0],
                salt: credentials[1]
            })
                .then(res.status(201))
                .catch(error => {
                    console.error(error);
                    res.status(400);
                });
        })
        .catch(error => {
            console.error(error);
            res.status(400)
        });
});

app.get("/salt/:email", (req, res) => {
    console.log("GET-request received from client");

    return model.UserModel.findAll({where: {email:req.params.email}, attributes:['salt']})
        .then(salt => res.send(salt))
        .catch(error => console.error(error));
});

app.post("/login", (req, res) => {
    console.log("POST-request received from client");

    model.UserModel.findAll({where: {email: req.body.params.email}, attributes: ['salt']})
        .then(salt => {
            if(salt.length !== 1) { res.status(401); return; }
            hashPassword.hashPassword(req.body.params.password, salt[0].dataValues.salt)
                .then(credentials => {
                    if(loginOk(req.body.params.email, credentials[0]))
                    {
                        let token = jwt.sign({email: req.body.params.email}, privateKey, {
                            expiresIn: 1800
                        });
                        res.json({jwt: token})
                    } else {
                        res.status(401);
                        res.json({error: "Not authorized"});
                    }
                })
                .catch(error => console.error(error))
        })
        .catch(error => console.error(error));
});

app.use("/auth", (req, res, next) => {
    console.log("Authorization request received from client");
    let token = req.headers["x-access-token"];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err || decoded.username !== req.body.username) {
            console.log("Token not OK");
            res.status(401);
            res.json({error: "Not authorized"});
        } else {
            console.log("Token OK");
            next();
        }
    })
});

app.get("/auth/user/:userId", (req, res) => {
    console.log("GET-request received from client");
    return model.UserModel.findAll({where: {[op.and]: [{userId: req.params.userId}, {username: req.body.username}]}})
        .then(user => {
            if (user.length === 1) {
                return user;
            } else {
                res.sendStatus(503);
            }
        })
        .then(user => res.send(user))
        .catch(error => console.error(error));
});

app.get("/tickets/:eventId", (req, res) => {
    console.log("GET-request received from client");

    return model.TicketModel.findAll({where: {eventId: req.params.eventId}})
        .then(tickets => res.send(tickets))
        .catch(error => console.error(error));
});

console.log("Server initalized");
