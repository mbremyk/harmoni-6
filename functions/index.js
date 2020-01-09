Object.defineProperty(exports, "__esModule", {value: true});
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const model = require('./model.js');
model.syncModels();
const sequelize = require("sequelize");
const op = sequelize.Op;
let cors = require("cors");

admin.initializeApp(functions.config().firebase);
const app = express();
app.use(cors({origin: true}));

const main = express();
main.use('/api/v1', app);
main.use(bodyParser.json());
exports.webApi = functions.https.onRequest(main);
const deployed = true;

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
        .then(_ => res.send(201))
        .catch(error => console.error(error))
});

console.log("Server initalized");
