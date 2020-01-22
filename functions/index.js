Object.defineProperty(exports, "__esModule", {value: true});
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
let bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const hashPassword = require("./userhandling");
const filehandler = require("./filehandler");
let cors = require("cors");
let fs = require("fs");
const mail = require("./mail.js");

//Express
const express = require("express");
const app = express();

if (!process.env.FIREBASE_CONFIG) {
    console.log("running local server");
    app.listen(8080);
} else {
    console.log("running firebase server");
    const main = express();
    main.use('/api/v1', app);
    /*main.use(bodyParser.json());
    main.use(bodyParser.urlencoded({extended: true}));*/
    exports.webApi = functions.https.onRequest(main);
}

app.use(cors({origin: true}));
app.use(bodyParser.json({limit: '100mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
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

let interval = 60 * 60 * 1000;

/**
 * Goes through the blacklist every hour and removes timed out tokens
 */
setInterval(() => {
    console.log("Removing expired tokens");
    console.log("Token count: " + jwtBlacklist.length);
    jwtBlacklist = jwtBlacklist.filter(token => {
        jwt.verify(token, privateKey, (err, decoded) => {
            return Date.now() > decoded.exp * 1000;
        });
    });
    console.log("Tokens after purge: " + jwtBlacklist.length);
}, interval);


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
 *                  ENDPOINTS:
 *
 *                  VERIFICATION
 * use      /auth
 * post     /login
 * get      /validate/username/:username
 * get      /validate/email/:email
 * post     /auth/logout
 * post     /auth/refresh
 *
 *                      USERS
 * post     /users
 * get      /users
 * put      /auth/users/:userId
 * get      /users/:userId                  ?auth?  ????
 * get      /auth/users/:userId
 *
 *                      EVENTS
 * post     /auth/events
 * put      /auth/events/:eventId
 * get      /events
 * get      /events/search/:searchText
 * get      /events/eventDetails/:eventId
 * get      /auth/events/users/:userId
 *
 *                      PERSONNEL
 * post     /auth/events/:eventId/personnel
 * put      /auth/events/:eventId/personnel/:personnelId
 * delete   /auth/events/:eventId/personnel/:personnelId
 * get      /auth/events/:eventId/personnel
 *
 *                      TICKETS
 * post     /auth/events/:eventId/tickets
 * put      /auth/events/:eventId/tickets/:type
 * delete   /auth/events/:eventId/tickets/:type
 * get      /events/:eventId/tickets
 *
 *                      GIGS
 * post     /auth/events/:eventId/gigs
 * get      /auth/events/:eventId/gigs
 * get      /auth/events/:eventId/gigs/:artistId
 * post     /auth/events/:eventId/gigs/:artistId/rider
 * get      /auth/events/:eventId/gigs/:artistId/rider
 *
 *                      MAIL
 * @link mail
 * use      /mail
 * post     /mail/bug
 * post     /mail/password
 */


/*
    VERIFICATION
 */


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
 * Checks if a user with the given email and password exists in the database and returns a token if login information is valid
 * body:
 * {
 *     email: string
 *     password: string
 * }
 *
 * @return {json} {jwt: token}
 */
app.post("/login", async (req, res) => {
    console.log("POST-request - /login");

    let salt = await db.getSaltByEmail(req.body.email);
    let credentials = await hashPassword.hashPassword(req.body.password, salt[0].dataValues.salt);

    let ok1 = await db.loginOk(req.body.email, credentials[0]);
    let ok2 = await db.onetimeLogin(req.body.email, credentials[0]);

    console.log('login:' + ok1 + ' ' + ok2);

    if (ok1) {

        return db.getUserByEmail(req.body.email).then(user => {
            console.log(user.dataValues);
            let token = getToken(user.dataValues);
            res.json({jwt: token});
        });

    } else if (ok2) {

        let result = await db.deleteOneTimeLogin(req.body.email);
        return db.getUserByEmail(req.body.email).then(user => {
            console.log(user.dataValues);
            let token = getToken(user.dataValues);
            res.json({jwt: token});
        });

    } else {

        res.status(401);
        res.json({error: "Not authorized"})
    }

});

app.get("/validate/username/:username", (req, res) => {
    console.log("GET-request - /validate/username/:username");
    return db.getUserByEmailOrUsername('', req.params.username).then(result => {
        console.log(result);
        res.send(result.length === 1)
    })
});


app.get("/validate/email/:email", (req, res) => {
    console.log("GET-request - /validate/email/:email");
    return db.getUserByEmail(req.params.email).then(result => {
        console.log(result);
        res.send(result !== null)
    })
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

    return res.sendStatus(201);
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
    return db.getUserByEmail(req.body.email).then(user => {
        let token = getToken(user[0].dataValues);
        res.json({jwt: token});
    });
});

app.put('/forgotPass/:email', (req, res) => {
    console.log('PUT-request - /forgotPass/:email');

    let email = req.params.email;
    return db.forgotPassword(email)
        .then(success => success ? res.status(201) : res.status(400))
        .catch(error => console.error(error));
});


/*
    USERS
*/


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
            if (user.length !== 0) {
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
 * Update user information
 * body:
 * {
 *     username: string
 *     email: string
 *     password: string
 *
 * }
 */
app.put("/auth/users/:userId", (req, res) => {
    console.log("PUT-request - auth/user/:userId");
    return db.updateUser(req.body).then(updateOk => updateOk ? res.sendStatus(200) : res.sendStatus(400));

});

/**
 *
 *
 */
app.delete("/auth/users/:userId", (req, res) => {
    console.log("GET-request - /auth/users/:userId");
    return db.deleteUser(req.params.userId).then(updateOk => updateOk ? res.sendStatus(200) : res.sendStatus(400))
});


/**
 *
 */
app.get("/users", (req, res) => {
    console.log("GET-request - /users");
    return db.getAllUsers().then(users => users ? res.status(201).send(users) : res.sendStatus(400));
});

/**
 * Get one user by id
 */
app.get("/users/:userId", (req, res) => {
    console.log("GET-request - /users/:userId");
    return db.getUserById(req.params.userId).then(user => (user !== null) ? res.status(201).send(user) : res.sendStatus(400));
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
    return db.getUserById(req.params.userId)
        .then(user => res.send(user))
        .catch(error => console.error(error));
});


/*
    EVENTS
 */


app.post("/auth/events", (req, res) => {
    console.log("POST-request - /events");
    if (req.body.imageUrl && req.body.imageUrl.includes("base64")) {
        filehandler.uploadToCloud(req.body.imageUrl, "img.png")
            .then(url => {
                console.log(url);
                req.body.imageUrl = url;
                console.log(req.body.imageUrl);
                db.createEvent(req.body).then(response => response.insertId ? res.status(201).send(response) : res.sendStatus(400));
            });
    } else {
        db.createEvent(req.body).then(response => response.insertId ? res.status(201).send(response) : res.sendStatus(400));
    }
});


/**
 * Get all events in database as an array + checks and deletes old entries
 * {
 *     eventId: int
 *     organizerId: int -> user(userId)
 *     eventName: string
 *     address: string
 *     ageLimit: int
 *     startTime: Date, YYYY-MM-DD HH:mm
 *     endTime: Date, YYYY-MM-DD HH:mm
 *     imageUrl: string
 *     image: Blob
 *     description: Text
 * }
 */
app.get("/events", (req, res) => {
    console.log("GET-request - /events");
    console.log("Deleting events older than 90 days");
    console.log("Quantity: ");
    db.deleteOldEvents()
        .then(e => {
            console.log(e.length);
            e.map(e => db.deleteEvent(e.eventId));
        })
        .then(() => {
                return db.getAllEvents()
                    .then(events => (events !== null) ? res.status(201).send(events) : res.sendStatus(400));
            }
        )
        .catch(error => console.error(error));
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
    return db.getEventsMatching(searchText).then(events => (events !== null) ? res.status(201).send(events) : res.sendStatus(400));
});


app.get("/events/eventDetails/:eventId", (req, res) => {
    console.log("GET-request - /events/eventDetails/:eventId");
    return db.getEventByEventId(req.params.eventId).then(event => (event !== {}) ? res.status(201).send(event) : res.sendStatus(404));
});


/**
 * header:
 *      {
 *          x-access-token: string
 *      }
 */
app.get("/auth/events/users/:userId", (req, res) => {
    console.log("GET-request - /events/user/:userId");
    let token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (decoded.userId == req.params.userId) {
        return db.getEventsByOrganizerId(decoded.userId)
            .then(events => res.send(events))
            .catch(error => console.error(error));
    } else {
        res.sendStatus(403);
    }
});


/**
 * header:
 *      {
 *          x-access-token: string
 *      }
 */
app.get("/myevents/users/:userId/", (req, res) => {
    console.log("GET-request - /myevents/user/:userId/");
    /*let token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (decoded.userId === req.params.userId) {*/
    return db.getMyEventsByUserId(req.params.userId)
        .then(events => res.send(events))
        .catch(error => console.error(error));
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
app.put('/auth/events/:eventId', (req, res) => {
    let userId = jwt.decode(req.headers['x-access-token']).userId;
    if (req.body.organizerId !== userId) {
        res.status(401);
        console.log('Not authorized to update event');
        return;
    }
    return db.updateEvent(req.body).then(updateOk => updateOk ? res.status(201) : res.status(400))
});


/**
 * Delete an event
 * body:
 * {
 *     event: Event
 * }
 */

app.delete('/auth/events/:eventId', (req, res) => {
    console.log("DELETE-request - /events/" + req.params.eventId);
    return db.deleteEvent(req.params.eventId).then(deleteOk => deleteOk ? res.sendStatus(201) : res.status(400))
});


/*
        PERSONNEL
 */


/**
 *  @header  x-access-token: string
 *  @body {Personnel[]}
 *  @return {json} {jwt: token}
 */
app.post("/auth/events/:eventId/personnel", (req, res) => {
    return db.addPersonnel(req.body).then((insertOk) => insertOk ? res.status(201).send(insertOk) : res.sendStatus(400));
});


/**
 *  @header  x-access-token: string
 *  @body {Personnel}
 *  @return {json} {jwt: token}
 */
app.put('/auth/events/:eventId/personnel', (req, res) => {
    return db.updatePersonnel(req.body).then(updateOk => updateOk ? res.status(201) : res.status(400))
});


/**
 *  @header  x-access-token: string
 *  @return {json} {jwt: token}
 */
app.delete('/auth/events/:eventId/personnel', (req, res) => {
    return db.removePersonnel(req.body).then(deleteOk => deleteOk ? res.status(201) : res.status(400))
});


/**
 *  @header  x-access-token: string
 *  @return {json} {jwt: token, Personnel[]}
 */
app.get("/auth/events/:eventId/personnel", (req, res) => {
    let eventId = decodeURIComponent(req.params.eventId);
    return db.getPersonnel(eventId).then(personnel => (personnel !== null) ? res.status(201).send(personnel) : res.sendStatus(400));
});


/*
    TICKETS
 */


/**
 *  @header  x-access-token: string
 *  @body {Ticket[]}
 *  @return {json} {jwt: token}
 */
app.post("/auth/events/:eventId/tickets", (req, res) => {
    return db.addTickets(req.body).then(insertOk => (insertOk) ? res.status(201) : res.status(400));
});


/**
 *  @header  x-access-token: string
 *  @body {Ticket}
 *  @return {json} {jwt: token}
 */
app.put('/auth/events/:eventId/tickets', (req, res) => {
    return db.updateTicket(req.body).then(updateOk => updateOk ? res.status(201) : res.status(400))
});

/**
 *  @header  x-access-token: string
 *  @return {json} {jwt: token}
 */
app.delete('/auth/events/:eventId/tickets/:type', (req, res) => {
    let eventId = decodeURIComponent(req.params.eventId);
    let type = decodeURIComponent(req.params.type);
    return db.removeTicket(eventId, type).then(deleteOk => deleteOk ? res.status(201) : res.status(400))
});


/**
 *  @header  x-access-token: string
 *  @return {json} {jwt: token, Ticket[]}
 */
app.get("/events/:eventId/tickets", (req, res) => {
    let eventId = decodeURIComponent(req.params.eventId);
    return db.getTickets(eventId).then(tickets => (tickets !== null) ? res.status(201).send(tickets) : res.sendStatus(400));
});


/*
    GIGS
 */


/**
 *  @header  x-access-token: string
 *  @body {Gig}
 *  @return {json} {jwt: token}
 */
app.post("/auth/events/:eventId/gigs", (req, res) => {
    db.addGig(req.body).then((insertOk) => insertOk ? res.status(201).send(insertOk) : res.sendStatus(503));
});

/**
 *  @header  x-access-token: string
 *  @return {json} {jwt: token, RiderItem[]}
 */
app.get("/auth/events/:eventId/gigs", (req, res) => {
    let eventId = decodeURIComponent(req.params.eventId);
    return db.getGigs(eventId).then(gigs => (gigs !== null) ? res.status(201).send(gigs) : res.sendStatus(400));
});

/**
 * Get a contract connected to an event and a artist
 *
 */

app.get("/auth/events/:eventId/gigs/:artistId", (req, res) => {
    let eventId = decodeURIComponent(req.params.eventId);
    let artistId = decodeURIComponent(req.params.artistId);
    db.getContract(eventId, artistId).then(contract => (contract !== null) ? res.status(201).send(contract) : res.sendStatus(400));
});


/**
 *  @header  x-access-token: string
 *  @body {RiderItem[]}
 *  @return {json} {jwt: token}
 */
app.post("/auth/events/:eventId/gigs/:artistId/rider", (req, res) => {
    db.addRiderItems(req.body).then((insertOk) => insertOk ? res.status(201).send(insertOk) : res.sendStatus(400));
});


/**
 *  @header  x-access-token: string
 *  @body {RiderItem[]}
 *  @return {json} {jwt: token}
 */
app.put("/auth/events/:eventId/gigs/:artistId/rider", (req, res) => {
    db.updateRiderItems(req.body).then((updateOk) => updateOk ? res.status(201).send(true) : res.status(401).send(false))

});

/**
 *  @header  x-access-token: string
 *  @return {json} {jwt: token, RiderItem[]}
 */
app.get("/auth/events/:eventId/gigs/:artistId/rider", (req, res) => {
    let eventId = decodeURIComponent(req.params.eventId);
    let artistId = decodeURIComponent(req.params.artistId);
    db.getRiderItems(eventId, artistId).then(riderItems => riderItems ? res.status(201).send(riderItems) : res.status(404).send([]));
});

/*
                    MAIL
 */
mail.addMailEndpoints(app, db);

/**
 * @link mail
 */

console.log("Server initalized");