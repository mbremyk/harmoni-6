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
 * Checks if the email address and password fits with a single user in the database
 *
 * @param email
 * @param password
 * @returns {Promise<boolean>}
 */
function loginOk(email, password) {
    return model.UserModel.findAll({where: {[op.and]: [{email: email}, {password: password}]}})
        .then(response => {
            return response.length === 1;
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
 * Get all events in database
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
    return model.EventModel.findAll({order: [['startTime', 'ASC']]})
        .then(events => res.send(events))
        .catch(error => console.error(error));
});

app.post("/event", (req, res) =>{
   console.log("POST-request received from client");
   return model.EventModel.create({
       eventName: req.body.eventName,
       address: req.body.eventAddress,
       description: req.body.eventDescription,
       ageLimit: req.body.ageLimit,
       image: req.body.image,
       startTime: req.body.startDate,
       endTime: req.body.endDate,
   })
       .then(res.status(201))
       .catch(error => {
           console.error(error);
           res.status(400);
       });
});



app.post("/gig", (req, res) =>{
   console.log("POST-request received from client");
   return model.GigModel.create({
       artistId: req.body.artistId,
       eventId: req.body.eventId,
       rider: req.body.rider,
       contract: req.body.contract,
   })
       .then(res.status(201))
       .catch(error => {
           console.error(error);
           res.status(400);
       });
});

app.get("/events/:id", (req, res) => {
    console.log("GET-request received from client");
    return model.EventModel.findOne({where: {eventId: req.params.id }})
        .then(events => res.send(events))
        .catch(error => console.error(error));
});

/**
 * Get all events where name or description contains searchText
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
    console.log("GET-request received from client");
    return model.EventModel.findAll({
        where: {[op.or]: [{eventName: {[op.like]: `%${req.params.searchText}%`}}, {description: {[op.like]: `%${req.params.searchText}%`}}]},
        order: [['startTime', 'ASC']]
    })
        .then(events => res.send(events))
        .catch(error => console.error(error));
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
    console.log("POST-request received from client");
    return model.UserModel.create({
        username: req.body.username,
        password: req.body.password,
        salt: req.body.salt,
        email: req.body.email
    })
        .then(res.status(201))
        .catch(error => {
            console.error(error);
            res.status(400);
        });
});

/**
 * @deprecated
 */
app.get("/salt/:email", (req, res) => {
    console.log("GET-request received from client");

    return model.UserModel.findAll({where: {email: req.params.email}, attributes: ['salt']})
        .then(salt => res.send(salt))
        .catch(error => console.error(error));
});

/**
 * Checks if a user with the given email and password exists in the database and returns a token if login information is valid
 * body:
 *      {
 *
 *      }
 */
app.post("/login", (req, res) => {
    console.log("POST-request received from client");
    loginOk(req.body.email, req.body.password).then(ok => {
        if (ok) {
            let token = jwt.sign({email: req.body.email}, privateKey, {
                expiresIn: 1800
            });
            res.json({jwt: token})
        } else {
            res.status(401);
            res.json({error: "Not authorized"});
        }
    });
});

app.use("/auth", (req, res, next) => {
    console.log("Authorization request received from client");
    let token = req.headers["x-access-token"];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err || decoded.email !== req.body.email || tokenIsBlacklisted(token)) {
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
    return model.UserModel.findAll({where: {[op.and]: [{userId: req.params.userId}, {email: req.body.email}]}})
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

app.post("/auth/refresh", (req, res) => {
    console.log("POST-request received from client");

    let token = req.headers["x-access-token"];
    jwtBlacklist.push(token);
    token = jwt.sign({email: req.body.email}, privateKey, {
        expiresIn: 1800
    });
    res.json({jwt: token});
});

app.post("/auth/logout", (req, res) => {
    console.log("POST-request received from client");

    let token = req.headers["x-access-token"];
    jwtBlacklist.push(token);
});

app.put("/auth/user/:email", (req, res) => {
    console.log("PUT-request received from client");

    return model.UserModel.update({
        username: req.body.username,
        email: req.body.newemail,
    }, {where: {email: req.params.email}})
});


console.log("Server initalized");
