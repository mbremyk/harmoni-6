const sequelize = require("sequelize");
const model = require('./model.js');
const op = sequelize.Op;


class Dao {
    /*
                                    USERS
     */

    /**
     * Checks if the email address and password fits with a single user in the database
     *
     * @param email
     * @param password
     * @returns {Promise<boolean>}
     */
    loginOk(email, password) {
        return model.UserModel.findAll(
            {where: {[op.and]: [{email: email}, {password: password}]}})
            .then(response => response.length === 1)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * creates a new User in the Database, returns true if user was
     * created successfully and false, if something went wrong
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
            })
            .then(response => response.userId >= 1)
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
            {where: {userId: user.userId}})
            .then(response => response[0] === 1 /*affected rows === 1*/)
            .catch(error => {
                console.error(error);
                return false;
            });
    }


    /**
     *  Deletes a user from the database, in order to not delete events etc. the user
     *  has been involved in, the user will be replaced by an anonomyous user before
     *  deleteing the user itself.
     *
     * @param userId
     * @returns {Promise<boolean>}
     */
    deleteUser(userId) {
        return (model.UserModel.update(
            {
                username: 'this user no longer exists',
                email: '',
                password: null,
                salt: null,

            },
            {where: {userId: userId}}))
            .then(() => {
                return model.UserModel.destroy({where: {userId: userId}})
            })
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    updatePassword(user) {
        return model.UserModel.update(
            {
                password: user.password,
                salt: user.salt
            },
            {where: {userId: user.userId}}
            ).then(response => response[0] === 1)
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
        return model.UserModel.findAll()
            .catch(error => {
                console.error(error);
                return [];
            });
    }

    /**
     * Return the user by their email address
     *
     * @param email
     * @returns {Promise<User>}
     */
    getUserByEmail(email) {
        return model.UserModel.findOne({where: {[op.and]: [{email: email}]}})
            .catch(error => {
                console.error(error);
                return {};
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
            .catch(error => {
                console.error(error);
                return {};
            });
    }

    /**
     * Return the user by their ID
     *
     * @param userId
     * @returns {Promise<{}>}
     */
    getUserById(userId) {
        return model.UserModel.findOne({where: {userId: userId}})
            .then(user => user ? user : {})
            .catch(error => {
                console.error(error);
                return {};
            });
    }

    getUserByEmailOrUsername(email, username) {
        let where = {[op.or]: [{email: email}, {username: username}]};
        return model.UserModel.findAll({where: where})
            .then(users => users)
            .error(error => {
                console.error(error);
                return {};
            });
    }


    /*
                                      EVENTS
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
                description: event.description,
                imageUrl: event.imageUrl
            })
            .then(created => ({insertId: (created.eventId)}))
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
                image: event.image,
                imageUrl: event.imageUrl,
                description: event.description,
            },
            {where: {eventId: event.eventId}})
            .then(response => response[0] === 1 /*affected rows === 1*/)
            .catch(error => {
                console.error(error);
                return false;
            });
    }


    cancelEvent(eventId) {
        return model.EventModel.update(
            {
                cancelled: true
            },
            {where: {eventId: eventId}})
            .then(response => response[0] === 1 /*affected rows === 1*/)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * deletes an event from the database, to do this, all associated data (gigs, tickets and personnel) will also
     * get deleted
     *
     * @param eventId
     * @returns {Promise<boolean>}
     */
    deleteEvent(eventId) {

        return model.GigModel.destroy({where: {eventId: eventId}})
            .then(() => {
                return model.TicketModel.destroy({where: {eventId: eventId}})
                    .then(() => {
                        return model.PersonnelModel.destroy({where: {eventId: eventId}})
                            .then(() => {
                                return model.EventModel.destroy({where: {eventId: eventId}})
                                    .then(res => res)
                            })
                    })
            }).catch(error => {
                console.error(error);
                return false;
            })
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
        return model.EventModel.findAll(
            {
                where: {[op.or]: [{eventName: {[op.like]: `%${searchText}%`}}, {description: {[op.like]: `%${searchText}%`}}]},
                order: [['startTime', 'ASC']]
            })
            .catch(error => {
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
                return {};
            });
    }

    /*
                                 GIG
     */

    /**
     * creates a new Gig in the Database, artistId and eventId
     * in the gig object has to be unique, returns false if something goes wrong
     *
     * @param gig
     * @returns {Promise<boolean>}
     */
    addGig(gig) {
        return model.GigModel.create(
            {
                artistId: gig.artistId,
                eventId: gig.eventId,
                rider: gig.rider,
                contract: gig.contract,
            })
            .then(response => response.id !== null)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * retrieves the gig assosciated with an event
     *
     * @param eventId
     * @returns {Promise<Gig[]>}
     */
    getGigs(eventId) {
        return model.GigModel.findAll({
            include: [{model: model.UserModel, attributes: ['username', 'email']}],
            where: {eventId: eventId}
        })
            .catch(error => {
                console.error(error);
                return [];
            });
    }

    /*
                            PERSONNEL
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
            })
            .then(response => response.id !== null)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * Updates the role of personnel, cannot change event or person as these are the primary key
     *
     * @param personnel
     * @returns {Promise<boolean>}
     */
    updatePersonnel(personnel) {
        return model.PersonnelModel.update(
            {
                role: personnel.role
            },
            {where: {eventId: personnel.eventId, personnelId: personnel.personnelId}})
            .then(response => response[0] === 1)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * Removes Personnel from an event
     *
     * @param personnel
     */
    removePersonnel(personnel) {
        return model.PersonnelModel.destroy(
            {where: {eventId: personnel.eventId, personnelId: personnel.personnelId}})
            .then(() => true)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * retrieves the personnel assosciated with an event
     *
     * @param eventId
     * @returns {Promise<Personnel[]>}
     */
    getPersonnel(eventId) {
        return model.PersonnelModel.findAll(
            {
                include: [{model: model.UserModel, attributes: ['username', 'email']}],
                where: {eventId: eventId}
            })
            .catch(error => {
                console.error(error);
                return [];
            });
    }


    /*
                            TICKETS
     */

    /**
     * creates a new Ticket in the Database, returns false if something goes wrong
     *
     * @param ticket
     * @returns {Promise<boolean>}
     */
    addTicket(ticket) {
        return model.TicketModel.create(
            {
                eventId: ticket.eventId,
                type: ticket.type,
                price: ticket.price,
                amount: ticket.amount
            })
            .then(response => response.id !== null)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * Updates a new Ticket in the Database, returns false if something goes wrong
     *
     * @param ticket
     * @returns {Promise<boolean>}
     */
    updateTicket(ticket) {
        return model.TicketModel.update(
            {
                price: ticket.price,
                amount: ticket.amount
            },
            {where: {eventId: ticket.eventId, type: ticket.type}})
            .then(response => response[0] === 1 /*affected rows === 1*/)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * Removes and entry from the Tickets in the Database
     *
     * @param ticket
     */
    removeTicket(ticket) {
        return model.TicketModel.destroy({where: {eventId: ticket.eventId, type: ticket.type}})
            .then(() => true)
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

    setContract(contract, gig, artist) {
        console.log(Object.keys(contract));
        let base64String = contract.data.toString('base64');
        let contentType = contract.contentType;

        return model.FileModel.create({name: contract.name, data: base64String, contentType: contentType})
            .then(fileInstance => {
                console.log(fileInstance);
                console.log(gig);
                console.log(artist);
                model.GigModel.findOne({where: {eventId: gig, artistId: artist}})
                    .then(gig => {
                            console.log(contract);
                            gig.update({contract: fileInstance.fileId});
                        }
                    );
            });

        /*model.GigModel.update(
            {contract: contract},
            { where: { gigId: gig, artistId: artist}}
        );
        model.update();*/

    }

    setRider(rider, gig, artist) {
        let base64String = rider.data.toString('base64');
        let contentType = rider.contentType1;

        return model.FileModel.create({name: rider.name, data: base64String, contentType: contentType})
            .then(fileInstance => {
                console.log(fileInstance);
                console.log(gig);
                console.log(artist);
                model.GigModel.findOne({where: {eventId: gig, artistId: artist}})
                    .then(gig => {
                            //console.log(contract);
                            gig.update({rider: fileInstance.fileId});
                        }
                    );
            });

    }


    getContract(gig, artist) {
        return model.GigModel.findAll({where: {eventId: gig, artistId: artist}})
            .then(gig => {
                    console.log(gig);
                    return model.FileModel.findByPk(gig[0].contract);
                }
            );
    }

    getRider(gig, artist) {
        return model.GigModel.findAll({where: {eventId: gig, artistId: artist}})
            .then(gig => {
                    console.log(gig);
                    return model.FileModel.findByPk(gig[0].rider);
                }
            );
    }

    /*
                           FILE STUFF
     */
}

//model.syncTestData();
module.exports = Dao;


