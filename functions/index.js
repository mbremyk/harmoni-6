Object.defineProperty(exports, "__esModule", {value: true});
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
let cors = require("cors");

// const model = require('./model.js');
// model.syncModels();
// const sequelize = require("sequelize");
// const op = sequelize.Op;
const dao = require('./dao.js');
let db = new dao();


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
            return response.length === 1;
        });
}

app.get("/test", (req, res) => {
    console.log(req);
    res.send("test functional");
});

app.get("/events", (req, res) =>
{
	console.log("GET-request received from client");
	return db.getAllEvents().then(events =>
	{
		if (events !== null)
		{res.status(201).send(events);}
		else
		{res.sendStatus(400);}
	});
});



app.get("/events/search/:searchText", (req, res) =>
{
	return db.findEventsBySearch(req.params.searchText).then(events =>
	{
		if (events !== null)
		{res.status(201).send(events);}
		else
		{res.sendStatus(400);}
	});
});



app.post("/user", (req, res) =>
{
	return db.createUser(req.body)
	         .then(success => success ? res.status(201) : res.status(400));
});



app.get("/salt/:email", (req, res) =>
{
	console.log("GET-request received from client");
	return db.getSaltByEmail(req.params.email)
	         .then(salt => res.send(salt))
	         .catch(error => console.error(error));
});



app.post("/login", (req, res) =>
{
	console.log("POST-request received from client");
	if (db.loginOk(req.body.email, req.body.password))
	{
		let token = jwt.sign({email: req.body.email}, privateKey, {
			expiresIn: 1800
		});
		res.json({jwt: token});
	}
	else
	{
		res.status(401);
		res.json({error: "Not authorized"});
	}
});



app.use("/auth", (req, res, next) =>
{
	console.log("Authorization request received from client");
	let token = req.headers["x-access-token"];
	jwt.verify(token, publicKey, (err, decoded) =>
	{
		if (err || decoded.username !== req.body.username)
		{
			console.log("Token not OK");
			res.status(401);
			res.json({error: "Not authorized"});
		}
		else
		{
			console.log("Token OK");
			next();
		}
	});
});



app.get("/auth/user/:userId", (req, res) =>
{
	console.log("GET-request received from client");
	return db.findUser(req.params.userId, req.body.username)
	         .then(user => res.send(user))
	         .catch(error => console.error(error));
});



app.get("/tickets/:eventId", (req, res) =>
{
	console.log("GET-request received from client");
	return db.getTicketsForEvent(req.params.eventId)
	         .then(tickets => res.status(201).send(tickets));
});



console.log("Server initalized");
