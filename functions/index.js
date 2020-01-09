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

function loginOk(username, password) {
    return model.UserModel.findAll({where: {[op.and]: [{username: username}, {password: password}]}})
        .then(response => {
            return response.length === 1;
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
    return model.UserModel.create({
        username: req.body.username,
        password: req.body.password,
        salt:     req.body.salt,
        email:    req.body.email
    })
        .then(res.status(201))
        .catch(error => {
            console.error(error);
            res.status(400);
        });
});

app.post("/login", (req, res) => {
	console.log("POST-request received from client");
    if (loginOk(req.body.username, req.body.password)) {
        let token = jwt.sign({username: req.body.username}, privateKey, {
            expiresIn: 1800
        });
        res.json({jwt: token})
    } else {
        res.status(401);
        res.json({error: "Not authorized"});
    }
});

app.use("/auth", (req, res, next) => {
    console.log("Authorization request received from client");
    let token = req.headers["x-access-token"];
    console.log(token);
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            console.log("Token not OK");
            res.status(401);
            res.json({error: "Not authorized"});
        } else {
            console.log("Token OK");
            next(decoded.username);
        }
    })
});

app.get("/auth/user/:userId", (req, res) => {
    console.log("GET-request received from client");

    return model.UserModel.findAll({where: {userId: req.params.userId}})
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

console.log("Server initalized");
