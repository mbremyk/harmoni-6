const model = require('./sequelize.js');
const express = require("express");
const mysql = require("mysql");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');

console.log("Skiræpp");

app.get("/concert", (req, res) => {
    console.log("GET-request received from client");
    return model.ConcertModel.findAll({order: [['dateTime', 'DESC']]}).then(concerts => res.send(concerts));
});

let server = app.listen(4000);