Object.defineProperty(exports, "__esModule", {value: true});
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fb = require("./fbConfig");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const fileHandler = require("./filehandler");
let cors = require("cors");
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
var multer  = require('multer');
let fs = require("fs");
let formidable = require("formidable");

/*var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage });*/

//var upload = multer({ dest: 'uploads/' });

//var bb = require('express-busboy');

// const model = require('./model.js');
// model.syncModels();
// const sequelize = require("sequelize");
// const op = sequelize.Op;
const dao = require('./dao.js');
let db = new dao();


let privateKey = (publicKey = "shhhhhverysecret");

admin.initializeApp(functions.config().firebase);
const app = express();

const {
    fileParser
} = require('express-multipart-file-parser');

app.use(fileParser({
    rawBodyOptions: {
        limit: '15mb',  //file size limit
    },
    busboyOptions: {
        limits: {
            fields: 20   //Number text fields allowed
        }
    },
}));
app.use(cors({origin: true}));

//app.use(fileUpload());
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
const path = require('path');

/*bb.extend(app, {
    upload: true,
    path: '/uploads',
    allowedPath: /./
});*/

/*app.use(fileUpload({
	createParentPath: true,
	useTempFiles: true
}));*/

const main = express();
main.use('/api/v1', app);
/*main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: true}));*/
exports.webApi = functions.https.onRequest(main);
const deployed = true;

/*main.use(fileUpload({
	createParentPath: true,
	useTempFiles: true
}));*/

/*bb.extend(app,{
	upload: true,
	path: path.join(__dirname, 'uploads'),
	allowedPath: /./
});*/


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



app.post("/contract/:eventId/:artistId", (req, res) => {
	console.log("Calling setContract");


    const {
        fieldname,
        originalname,
        encoding,
        mimetype,
        buffer,
    } = req.files[0];
    let file = req.files[0];
    console.log(req.files[0].originalname);
    console.log(req.files[0]);

	//var writeStream = fs.createWriteStream('./uploads/'+file.originalname);

	fs.writeFile(`${__dirname}/uploads/`+file.originalname, file.buffer, (err) => {
		if (err) throw err;
		console.log('The file has been saved!');
	});

	// This pipes the POST data to the file
	/*req.files.pipe(writeStream);

	// After all the data is saved, respond with a simple html form so they can post more data
	req.on('end', function () {
		/*res.writeHead(200, {"content-type":"text/html"});
		res.end('<form method="POST"><input name="test" /><input type="submit"></form>');*/
	//});

	// This is here incase any errors occur
	/*writeStream.on('error', function (err) {
		console.log(err);
	});*/

   res.send("done")
	//console.log("Body: "+req.files.file.name);

	/*try {*/
		/*if(req.files) {
			res.send({
				status: false,
				message: 'No file uploaded'
			});
		} else {
			//Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
			let avatar = req.files.file;

			//Use the mv() method to place the file in upload directory (i.e. "uploads")
			avatar.mv('./uploads/' + avatar.name);

			//send response
			res.send({
				status: true,
				message: 'File is uploaded',
				data: {
					name: avatar.name,
					mimetype: avatar.mimetype,
					size: avatar.size
				}
			});
		}
	/*} catch (err) {
		console.log("Error");

		res.status(500).send(err);
	}*/
    /*db.setContract(req.body, req.params.eventId, req.params.artistId)
		.then(() => res.send("Change made"));*/
});


app.get("/contract/:eventId/:artistId", (req, res) => {
	console.log("downloading file");

	const file = `${__dirname}/uploads/test.png`;
	res.download(file); // Set disposition and send it.

	/*db.getContract(req.params.eventId, req.params.artistId)
		.then(result => {
			res.send(JSON.stringify(result));
			}
		);*/
});

app.use("/auth", (req, res, next) => {
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
