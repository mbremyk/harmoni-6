const sequelize = require("sequelize");
const model = require('./model.js');
const op = sequelize.Op;


class Dao {
    /*
    TODO: USERS
     */

    /**
     * Checks if the email address and password fits with a single user in the database
     *
     * @param email
     * @param password
     * @returns {Promise<boolean>}
     */
    loginOk(email, password) {
        return model.UserModel.findAll({where: {[op.and]: [{email: email}, {password: password}]}}).then(response => {
            return response.length === 1;
        }).catch(error => {
            console.error(error);
            return false;
        });
    }

    /**
     * creates a new User in the Database, returs true if user was
     * created successfully and false, if somethng went wrong
     *
     * @param user
     * @returns {Promise<boolean>}
     */
    createUser(user) {
        return model.UserModel.create(
            {
                username: user.username,
                password: user.password,
                salt: user.salt,
                email: user.email
            }
        ).then(response => response.userId >= 1)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * Updates the  User with correct id in the Database, returs true if user was
     * updated successfully and false, if somethng went wrong
     *
     * @param user
     * @returns {Promise<boolean>}
     */
    updateUser(user) {
        return model.UserModel.update(
            {
                username: user.username,
                email: user.email
            },
            {where: {userId: user.userId}}
        ).then(response => response[0] === 1 /*affected rows === 1*/)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * finds all registered user
     *
     * @returns {Promise<User[]>}
     */
    getAllUsers() {
        return model.UserModel.findAll();
    }

    /**
     * Return the user by their email address
     *
     * @param email
     * @returns {Promise<User>}
     */
    getUserByEmail(email) {
        return model.UserModel.findOne({where: {[op.and]: [{email: email}]}})
            .then(user => user)
            .catch(error => {
                console.error(error);
                return null;
            });
    }

    /**
     * Return the salt assosciated to a user by their email address
     *
     * @param email
     * @returns {Promise<T>}
     */
    getSaltByEmail(email) {
        return model.UserModel.findAll({where: {email: email}, attributes: ['salt']})
            .then(salt => {
                return salt;
            })
            .catch(error => {
                console.error(error);
                return {};
            });
    }

    /**
     * Return the user by their ID
     *
     * @param userId
     * @returns {Promise<User>}
     */
    getUserById(userId) {
        return model.UserModel.findOne({where: {userId: userId}})
            .then(user => {
                if (user) {
                    return user;
                }
                return {};
            }).catch(error => {
                console.error(error);
                return {};
            });
    }


    /*
    TODO: EVENTS
     */

    /**
     * creates a new Event in the Database, returns the ID the event was assigned
     * by the database in attribute 'insertId'
     *
     * @param event
     * @returns {Promise<number>}
     */
    createEvent(event) {
        return model.EventModel.create(
            {
                organizerId: event.organizerId,
                eventName: event.eventName,
                address: event.address,
                ageLimit: event.ageLimit,
                startTime: event.startTime,
                endTime: event.endTime,
                description: event.description
            }
        ).then(created => ({insertId: (created.eventId)}))
            .catch(error => {
                console.error(error);
                return null;
            });
    }

    /**
     * Updates the Event with correct id in the Database, returs true if the event was
     * updated successfully and false if somethng went wrong
     *
     * @param event
     * @returns {Promise<boolean>}
     */
    updateEvent(event) {
        return model.EventModel.update(
            {
                organizerId: event.organizerId,
                eventName: event.eventName,
                address: event.address,
                ageLimit: event.ageLimit,
                startTime: event.startTime,
                endTime: event.endTime,
                description: event.description,
                imageUrl: event.imageUrl
            },
            {where: {eventId: event.eventId}}
        ).then(response => response[0] === 1 /*affected rows === 1*/)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * Finds all registered events
     *
     * @returns {Promise<Event[]>}
     */
    getAllEvents() {
        return model.EventModel.findAll({order: [['startTime', 'ASC']]})
            .catch(error => {
                console.error(error);
                return [];
            });
    }

    /**
     * looks for events where the searchtext exists in eventName or description, returns the events in an array
     * the array will be empty if there are no results or if an error occurs
     *
     * @param searchText
     * @returns {Promise<Event[]>}
     */
    getEventsMatching(searchText) {
        return model.EventModel.findAll({
            where: {[op.or]: [{eventName: {[op.like]: `%${searchText}%`}}, {description: {[op.like]: `%${searchText}%`}}]},
            order: [['startTime', 'ASC']]
        }).catch(error => {
            console.error(error);
            return [];
        });
    }

    /**
     * retrieves all events a user is an organizer for
     *
     * @param userId
     * @returns {Promise<Event[]>}
     */
    getEventsByOrganizerId(userId) {
        return model.EventModel.findAll({where: {organizerId: userId}, order: [['startTime', 'ASC']]})
            .catch(error => {
                console.error(error);
                return [];
            });
    }

    /**
     * retrieves the event by its ID
     *
     * @param eventId
     * @returns {Promise<Event>}
     */
    getEventByEventId(eventId) {
        return model.EventModel.findOne({where: {eventId: eventId}})
            .catch(error => {
                console.error(error);
            });
    }

    /*
    TODO: GIG
     */

    /**
     * creates a new Gig in the Database, artistId and eventId
     * in the gig object has to be unique, returns false if something goes wrong
     *
     * @param gig
     * @returns {Promise<boolean>}
     */
    addGig(gig) {
        return model.GigModel.create({
            artistId: gig.artistId,
            eventId: gig.eventId,
            rider: gig.rider,
            contract: gig.contract,
        }).then(response => response.id !== null)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * retrieves the gig assosciated with an event
     *
     * @param eventId
     * @returns {Promise<Gig>}
     */
    getGig(eventId) {
        return model.GigModel.findOne({where: {eventId: eventId}})
            .catch(error => {
                console.error(error);
                return {};
            });
    }

    /*
    TODO: PERSONNEL
     */

    /**
     * adds personnel to an event, return
     *
     * @param personnel
     * @returns {Promise<boolean>}
     */
    addPersonnel(personnel) {
        return model.PersonnelModel.create(
            {
                personnelId: personnel.personnelId,
                eventId: personnel.eventId,
                role: personnel.role
            }
        ).then(response => response.id !== null)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * retrieves the gig assosciated with an event
     *
     * @param eventId
     * @returns {Promise<Personnel[]>}
     */
    getPersonnel(eventId) {
        return model.PersonnelModel.findAll({where: {eventId: eventId}})
            .catch(error => {
                console.error(error);
                return [];
            });
    }


    /*
    TODO: TICKETS
     */

    /**
     * creates a new Gig in the Database, artistId and eventId
     * in the gig object has to be unique, returns false if something goes wrong
     *
     * @param ticket
     * @returns {Promise<boolean>}
     */
    addTicket(ticket) {
        return model.TicketModel.create({
            eventId: ticket.eventId,
            type: ticket.type,
            price: ticket.price,
            amount: ticket.amount
        }).then(response => response.id !== null)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * retrieves all tickets for an event
     *
     * @param eventId
     * @returns {Promise<Ticket[]>}
     */
    getTickets(eventId) {
        return model.TicketModel.findAll({where: {eventId: eventId}})
            .then(tickets => tickets)
            .catch(error => {
                console.error(error);
                return []
            });
    }

    /*
    TODO: FILE STUFF
     */
}

module.exports = Dao;


