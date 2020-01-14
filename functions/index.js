Object.defineProperty(exports, "__esModule", {value: true});
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const hashPassword = require("./userhandling");
let cors = require("cors");
let fs = require("fs");


//Express
const express = require("express");
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const path = require('path');

const main = express();
main.use('/api/v1', app);
/*main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: true}));*/
exports.webApi = functions.https.onRequest(main);

//Sequelize
const model = require('./model.js');
const dao = require('./dao.js');
let db = new dao();
model.syncModels();

let privateKey = (publicKey = "shhhhhverysecret");
const deployed = true;

/**
 * A list of active blacklisted tokens that are not allowed
 *
 * @type {*[]}
 */
let jwtBlacklist = [];

/**
 * Checks if the token is in the blacklist
 *
 * @param token
 * @returns {boolean}
 */
function tokenIsBlacklisted(token) {
    return jwtBlacklist.includes(token);
}

/**
 * Goes through the blacklist every hour and removes timed out tokens
 */
setInterval(() => {
    jwtBlacklist = jwtBlacklist.filter(token => {
        token.isValid();
    })
}, 60 * 60 * 1000);

/**
 * Creates a token based on the specified user information
 *
 * @param user JSON object containing user information, usually fetched from database
 * @returns {string} token
 */
function getToken(user) {
    return jwt.sign(user, privateKey, {
        expiresIn: 1800
    });
}

/**
 * Endpoints:
 * get /test
 * get /users
 * get /users/:userId
 * get /events
 * get /events/search/:searchText
 * get /events/eventDetails/:eventId
 * get /tickets/:eventId
 * post /users
 * post /events
 * post /gig
 * post /login
 * use /auth
 * get /auth/users/:userId
 * get /auth/events/users/:userId
 * post /auth/refresh
 * post /auth/logout
 * put /auth/user/:userId
 */

/**
 * Test endpoint. Use at own risk
 */
app.get("/test", (req, res) => {
    console.log(req);
    res.send("test functional");
});

/**
 *
 */
app.get("/users", (req, res) => {
    console.log("GET-request - /users");
    return db.getAllUsers().then(users => {
        if (users !== null) {
            res.status(201).send(users);
        } else {
            res.sendStatus(400);
        }
    });
});

/**
 * Get one user by id
 */
app.get("/users/:userId", (req, res) => {
    console.log("GET-request - /users/:userId");
    return db.getUserById(req.params.userId).then(user => {
        if (user !== null) {
            res.status(201).send(user);
        } else {
            res.sendStatus(400);
        }
    });
});

/**
 * Get all events in database as an array
 * {
 *     eventId: int
 *     organizerId: int -> user(userId)
 *     eventName: string
 *     address: string
 *     ageLimit: int
 *     startTime: Date, dd/MM/YYYY HH:mm
 *     endTime: Date, dd/MM/YYYY HH:mm
 *     imageUrl: string
 *     image: Blob
 *     description: Text
 * }
 */

app.get("/events", (req, res) => {
    console.log("GET-request - /events");
    return db.getAllEvents().then(events => {
        if (events !== null) {
            res.status(201).send(events);
        } else {
            res.sendStatus(400);
        }
    });
});

/**
 * Get all events where eventName or description contains searchText
 * {
 *     eventId: int
 *     organizerId: int -> user(userId)
 *     eventName: string
 *     address: string
 *     ageLimit: int
 *     startTime: Date, yyyy-MM-dd hh-mm-ss
 *     endTime: Date, yyyy-MM-dd hh-mm-ss
 *     imageUrl: string
 *     image: Blob
 *     description: Text
 * }
 */
app.get("/events/search/:searchText", (req, res) => {
    console.log('GET-request - /events/search/:searchText');
    let searchText = decodeURIComponent(req.params.searchText);
    return db.getEventsMatching(searchText).then(events => {
        if (events !== null) {
            res.status(201).send(events);
        } else {
            res.sendStatus(400);
        }
    });
});

app.get("/events/eventDetails/:eventId", (req, res) => {
    console.log("GET-request - /events/eventDetails/:eventId");
    return db.getEventByEventId(req.params.eventId).then(events => {
        if (events !== null) {
            res.status(201).send(events);
        } else {
            res.sendStatus(400);
        }
    });
});

/**
 * Get tickets for specific event
 */
app.get("/tickets/:eventId", (req, res) => {
    console.log("GET-request - /tickets/:eventId");
    return db.getTicketsForEvent(req.params.eventId)
        .then(tickets => res.status(201).send(tickets));
});

/**
 * Create new user
 * body:
 * {
 *     username: string
 *     password: string
 *     email: string
 * }
 */
app.post("/users", (req, res) => {
    console.log('POST-request - /user');
    return db.getUserByEmailOrUsername(req.body.email, req.body.username)
        .then(user => {
            if (user) {
                res.sendStatus(409);
            } else {
                return hashPassword.hashPassword(req.body.password).then(credentials => {
                    db.createUser({
                        username: req.body.username,
                        email: req.body.email,
                        password: credentials[0],
                        salt: credentials[1]
                    })
                        .then(success => success ? res.status(201) : res.status(400))
                        .catch(error => console.error(error));
                });
            }
        });
});

/**
 *
 */

app.post("/events", (req, res) => {
    console.log("POST-request -/events");
    return db.createEvent(req.body).then(response => response.insertId ? res.status(201).send(response) : res.status(400));
});


/**
 * Changes the information of an Event
 * body:
 * {
 *     event: Event
 * }
 *
 * @return {json} {jwt: token}
 */

app.put('/auth/events', (req, res) => {
    console.log("PUT-request - /auth/events");
    db.updateEvent(req.body).then(updateOk => updateOk ? res.status(201) : res.status(400))
});

/**
 * Creates a Gig
 * body:
 * {
 *     gig: Gig
 * }
 *
 * @return {json} {jwt: token}
 */
app.post("/gigs", (req, res) => {
    console.log("POST-request - /gigs");
    db.addGig(req.body).then(response => response ? res.status(201).send(response) : res.status(400));
});

/**
 * Checks if a user with the given email and password exists in the database and returns a token if login information is valid
 * body:
 * {
 *     email: string
 *     password: string
 * }
 *
 * @return {json} {jwt: token}
 */
app.post("/login", (req, res) => {
    console.log("POST-request - /login");

    return db.getSaltByEmail(req.body.email)
            .then(salt => {
            if (salt.length !== 1) {
                res.sendStatus(401);
                return;
            }
            hashPassword.hashPassword(req.body.password, salt[0].dataValues.salt).then(credentials => {
                db.loginOk(req.body.email, credentials[0]).then(ok => {
                    if (ok) {
                        db.getUserByEmail(req.body.email).then(user => {
                            console.log(user.dataValues);
                            let token = getToken(user.dataValues);
                            res.json({jwt: token});
                        })
                    } else {
                        res.status(401);
                        res.json({error: "Not authorized"})
                    }
                });
            })
        });
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

	fs.writeFile(`${__dirname}/uploads/`+file.originalname, file.buffer, (err) => {
		if (err){
			res.send(err);
		}else{
			console.log('The file has been saved!');
			res.send("done");
		}
	});
	//Todo set access here
    /*db.setContract(req.body, req.params.eventId, req.params.artistId)
		.then(() => res.send("Change made"));*/
});


app.get("/contract/:eventId/:artistId", (req, res) => {
	console.log("downloading file");

    //Todo check access here
    /*db.getContract(req.params.eventId, req.params.artistId)
        .then(result => {
            res.send(JSON.stringify(result));
            }
        );*/

	const file = `${__dirname}/uploads/nativelog.txt`;
	res.download(file); // Set disposition and send it.
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
    });
});
/**
 * Checks if x-access-token is active and not blacklisted and if the payload of the token matches the email of the user
 * header:
 * {
 *     x-access-token: string
 * }
 */
app.use("/auth", (req, res, next) => {
    console.log("Authorization request received from client");
    let token = req.headers["x-access-token"];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err || tokenIsBlacklisted(token)) {
            console.log("Token not OK");
            res.status(401);
            res.json({error: "Not authorized"});
        } else {
            console.log("Token OK");
            next();
        }
    })
});

/**
 * Get information about a specific user based on userId
 * header:
 *      {
 *          x-access-token: string
 *      }
 *
 * body:
 * {
 *     email: string
 * }
 */
app.get("/auth/users/:userId", (req, res) => {
    console.log("GET-request - /user/:userId");
    return db.getUserByEmail(req.params.userId, req.body.email)
        .then(user => res.send(user))
        .catch(error => console.error(error));
});

/**
 * header:
 *      {
 *          x-access-token: string
 *      }
 */

app.get("/auth/events/user/:userId", (req, res) => {
    console.log("GET-request - /events/user/:userId");
    let token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    console.log(decoded);
    if (decoded.userId == req.params.userId) {
        return db.getEventsByOrganizerId(decoded.userId)
            .then(events => res.send(events))
            .catch(error => console.error(error));
    } else {
        res.sendStatus(403);
    }
});

/**
 * Invalidate old access token and get a new one
 * header:
 * {
 *      x-access-token: string
 * }
 *
 * @return {json} {jwt: token}
 */
app.post("/auth/refresh", (req, res) => {
    console.log("POST-request - /auth/refresh");

    let token = req.headers["x-access-token"];
    jwtBlacklist.push(token);
    db.getUserByEmail(req.body.email).then(user => {
        let token = getToken(user[0].dataValues);
        res.json({jwt: token});
    });
});

/**
 * Invalidates your access token
 * header:
 * {
 *     x-access-token: string
 * }
 */
app.post("/auth/logout", (req, res) => {
    console.log("POST-request - /logout");

    let token = req.headers["x-access-token"];
    jwtBlacklist.push(token);
});

/**
 * Update user information
 * body:
 * {
 *     username: string
 *     email: string
 *     newEmail: string
 * }
 */
app.put("/auth/users/:userId", (req, res) => {
    console.log("PUT-request - auth/user/:userId");

    return db.updateUser(req.body)
        .then(res.sendStatus(200));
});

/**
 * header:
 *      {
 *          x-access-token: string
 *      }
 */
app.get("/auth/events/user/:userId", (req, res) => {
    console.log("GET-request - /events/user/:userId");
    let token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    console.log(decoded);
    if (decoded.userId === req.params.userId) {
        return db.getEventsByOrganizerId(decoded.userId)
            .then(events => res.send(events))
            .catch(error => console.error(error));
    } else {
        res.sendStatus(403);
    }
});

console.log("Server initalized");
