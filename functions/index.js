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

app.get("/concerts", (req, res) => {
    console.log("GET-request received from client");
    return model.ConcertModel.findAll({order: [['dateTime', 'ASC']]})
        .then(concerts => res.send(concerts))
        .catch(error => console.error(error));
});

app.get("/concerts/search/:searchText", (req, res) => {
    console.log("GET-request received from client");
    return model.ConcertModel.findAll({
        where: {[op.or]: [{concertName: {[op.like]: `%${req.params.searchText}%`}}, {description: {[op.like]: `%${req.params.searchText}%`}}]},
        order: [['dateTime', 'ASC']]
    })
        .then(concerts => res.send(concerts))
        .catch(error => console.error(error));
});

app.post("/user", (req, res) => {
    console.log("POST-request received from client");
    console.log(req.body);
    return model.UserModel.create({
        username: req.body.username,
        password: req.body.password,
        salt: req.body.salt,
        email: req.body.email
    })
        .then(res.sendStatus(201))
        .catch(error => console.error(error));
});

app.post("/login", (req, res) => {
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

console.log("Server initalized");
