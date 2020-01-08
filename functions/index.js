import Sequelize from 'sequelize';
import { compare, hash } from 'bcrypt';
import {sign, verify} from "jsonwebtoken";Object.defineProperty(exports, "__esModule", {value: true});
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const model = require('./model.js');
model.syncModels();
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
console.log("Server initalized");
