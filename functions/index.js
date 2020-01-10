Object.defineProperty(exports, "__esModule", {value: true});
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
let cors = require("cors");


//Express
const express = require("express");
const app = express();
app.use(cors({origin: true}));
const main = express();
main.use('/api/v1', app);
main.use(bodyParser.json());
exports.webApi = functions.https.onRequest(main);

//Sequalize
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

function getToken(user) {
    return jwt.sign(user, privateKey, {
        expiresIn: 1800
    });
}

/**
 * Test endpoint. Use at own risk
 */
app.get("/test", (req, res) => {
    console.log(req);
    res.send("test functional");
});

/**
 * Get all events in database as an array
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
app.get("/events", (req, res) => {
    console.log("GET-request received from client");
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
    let searchText = decodeURIComponent(req.params.searchText);
    return db.getEventsMatching(searchText).then(events => {
        if (events !== null) {
            res.status(201).send(events);
        } else {
            res.sendStatus(400);
        }
    });
});

/**
 * Create new user
 * body:
 *      {
 *          username: string
 *          password: string
 *          email: string
 *      }
 */
app.post("/user", (req, res) => {
    return db.createUser(req.body)
        .then(success => success ? res.status(201) : res.status(400));
});

/**
 * Checks if a user with the given email and password exists in the database and returns a token if login information is valid
 * body:
 *      {
 *          email: string
 *          password: string
 *      }
 *
 * @return {json} {jwt: token}
 */
app.post("/login", (req, res) => {
    console.log("POST-request received from client");
    db.loginOk(req.body.email, req.body.password).then(ok => {
        if (ok) {
            db.getUser(req.body.email).then(user => {
                console.log(user[0].dataValues);
                let token = getToken(user[0].dataValues);
                res.json({jwt: token});
            })
        } else {
            res.status(401);
            res.json({error: "Not authorized"})
        }
    });
});

/**
 * Checks if x-access-token is active and not blacklisted and if the payload of the token matches the email of the user
 * header:
 *      {
 *          x-access-token: string
 *      }
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
 *      {
 *          email: string
 *      }
 */
app.get("/auth/user/:userId", (req, res) => {
    console.log("GET-request received from client");
    return db.getUser(req.params.userId, req.body.email)
        .then(user => res.send(user))
        .catch(error => console.error(error));
});

/**
 * Get tickets for specific event
 */
app.get("/tickets/:eventId", (req, res) => {
    console.log("GET-request received from client");
    return db.getTicketsForEvent(req.params.eventId)
        .then(tickets => res.status(201).send(tickets));
});

/**
 * Invalidate old access token and get a new one
 * header:
 *      {
 *          x-access-token: string
 *      }
 *
 * @return {json} {jwt: token}
 */
app.post("/auth/refresh", (req, res) => {
    console.log("POST-request received from client");

    let token = req.headers["x-access-token"];
    jwtBlacklist.push(token);
    db.getUser(req.body.email).then(user => {
        let token = getToken(user[0].dataValues);
        res.json({jwt: token});
    });
});

app.post("/auth/logout", (req, res) => {
    console.log("POST-request received from client");

    let token = req.headers["x-access-token"];
    jwtBlacklist.push(token);
});

app.put("/auth/user/:userId", (req, res) => {
    console.log("PUT-request received from client");

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
    console.log("GET-request received from client");
    let token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    console.log(decoded);
    if (decoded.userId == req.params.userId) {
        return db.getEventsUser(decoded.userId)
            .then(events => res.send(events))
            .catch(error => console.error(error));
    } else {
        res.sendStatus(403);
    }
});

console.log("Server initalized");
