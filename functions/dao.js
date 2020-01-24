const {Op, QueryTypes} = require('sequelize');
const moment = require("moment");
const hashPassword = require("./userhandling");
const sequelize = require("sequelize");
const model = require('./model.js');
const op = sequelize.Op;
const mail = require("./mail.js");
const isCI = require('is-ci');
const props = isCI ? "" : require("./properties.js");
const test = (process.env.NODE_ENV === 'test');
const filehandler = require("./filehandler.js");

let mailProps = isCI ? "" : new props.MailProperties();
let url = "https://harmoni-6.firebaseapp.com/";


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
     * Creates a temporary user without password or salt and sends an email to the given email address
     *
     * @param email
     * @returns {Promise<User>}
     */
    createTempUser(email) {
        return model.UserModel.create({email: email, username: ''})
            .then(user => {
                return model.UserModel.update({username: 'guest' + user.userId}, {where: {userId: user.userId}})
                    .then(() => {
                        if (!isCI && !test) {
                            user.username = 'guest' + user.userId;
                            let post = {
                                to: email,
                                from: mailProps.username,
                                subject: 'Anmodning om kontakt på Harmoni',
                                text: `Hei\n\nHarmoni er en nettside for planlegging av konserter og andre arrangementer som skal gjøre det enklere for arrangører, artister og personell å samarbeide.\nNoen har lagt deg til  som artist på et arrangement, og oppgitt din epost-adresse.\nHvis du ønsker å se informasjon om arrangementet og kunne laste ned kontrakt samt opprette en rider, må du først opprette en bruker med denne epost-addressen her ${url}ny-bruker/\n\nVi håper å se deg snart\n\nMed vennlig hilsen\nHarmoni team 6`
                            };
                            mail.sendMail(post);
                        }
                        return user;
                    })
            })
            .catch(error => {
                console.error(error);
                return null;
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

        if (user.password !== '') {
            return hashPassword.hashPassword(user.password).then(credentials => {
                return model.UserModel.update(
                    {
                        password: credentials[0],
                        salt: credentials[1],
                        username: user.username,
                        email: user.email
                    },
                    {where: {userId: user.userId}})
                    .then(response => response[0] === 1 /*affected rows === 1*/)
                    .catch(error => {
                        console.error(error);
                        return false;
                    });
            })
        } else {
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
                username: 'Denne brukeren finnes ikke lenger',
                email: null,
                password: null,
                salt: null,

            },
            {where: {userId: userId}}))
            .then(() => {
                return this.getEventsByOrganizerId(userId)
                    .then(events => {
                        return Promise.all(
                            events.map(event => {
                                this.cancelEvent(event.eventId);
                            }))
                    });
                // return model.UserModel.destroy({where: {userId: userId}})
            })
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    async forgotPassword(email) {
        let result = await this.getUserByEmail(email);
        if (result === null) {
            return;
        }

        let newPass = Math.random().toString(36).substring(7);
        let salt = await this.getSaltByEmail(email);
        let credentials = await hashPassword.hashPassword(newPass, salt[0].dataValues.salt);

        return model.UserModel.update(
            {
                tempPassword: credentials[0]
            },
            {where: {email: email}}
        ).then(response => response ? newPass : null)
            .catch(error => {
                console.error(error);
                return null;
            });
    }

    onetimeLogin(email, password) {
        return model.UserModel.findAll(
            {where: {[op.and]: [{email: email}, {tempPassword: password}]}})
            .then(response => response.length === 1)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    deleteOneTimeLogin(email) {
        return model.UserModel.update(
            {
                tempPassword: null
            },
            {where: {email: email}}
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
        return model.UserModel.findAll({attributes: ['userId', 'username', 'email']})
            .catch(error => {
                console.error(error);
                return [];
            });
    }

    /**
     * Return the user by their email address
     *
     * @param email
     * @returns {Promise<{}>}
     */
    getUserByEmail(email) {
        return model.UserModel.findOne({where: {email: email}, attributes: ['userId', 'username', 'email']})
            .catch(error => {
                console.error(error);
                return {};
            });
    }

    /**
     * Return the salt assosciated to a user by their email address
     *
     * @param email
     * @returns {Promise<{}>}
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
        return model.UserModel.findOne({where: {userId: userId}, attributes: ['userId', 'username', 'email']})
            .then(user => user ? user : {})
            .catch(error => {
                console.error(error);
                return {};
            });
    }

    getUserByUsername(username) {
        return model.UserModel.findAll({where: {username: username}})
            .then(users => users)
            .error(error => {
                console.error(error);
                return {};
            });
    }

    getUserByEmailOrUsername(email, username) {
        let where = {[op.or]: [{email: email}, {username: username}]};
        return model.UserModel.findAll({where: where, attributes: ['userId', 'username', 'email']})
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
     * @returns {Promise<T>}
     */
    createEvent(event) {
        return model.EventModel.create(
            {
                organizerId: event.organizerId,
                eventName: event.eventName,
                city: event.city,
                address: event.address,
                placeDescription: event.placeDescription,
                ageLimit: event.ageLimit,
                startTime: event.startTime,
                endTime: event.endTime,
                imageUrl: event.imageUrl,
                description: event.description,
            })
            .then(created => ({insertId: (created.eventId)}))
            .catch(error => {
                console.error(error);
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
        return model.EventModel.findOne({where: {eventId: event.eventId}, attributes: ['cancelled']})
            .then(e => e ? e.dataValues.cancelled : null)
            .then(e => {
                if (e === null) {
                    return false;
                } else {
                    return model.EventModel.update(
                        {
                            organizerId: event.organizerId,
                            eventName: event.eventName,
                            address: event.address,
                            city: event.city,
                            placeDescription: event.placeDescription,
                            ageLimit: event.ageLimit,
                            startTime: event.startTime,
                            endTime: event.endTime,
                            imageUrl: event.imageUrl,
                            description: event.description,
                            cancelled: event.cancelled,
                        },
                        {where: {eventId: event.eventId}})
                        .then(response => {
                            if (e !== event.cancelled && !e && !isCI && !test) {
                                return this.getGigs(event.eventId)
                                    .then(gigs => gigs.map(gig => gig.dataValues.artistId))
                                    .then(gigs => {
                                        return this.getPersonnel(event.eventId)
                                            .then(personnel => personnel.map(person => person.dataValues.personnelId))
                                            .then(personnel => {
                                                let set = new Set(gigs);
                                                personnel.map(person => set.add(person));

                                                return model.UserModel.findAll({where: {userId: {[op.in]: Array.from(set)}}})
                                                    .then(users => users.map(user => user.dataValues.email))
                                                    .then(users => {
                                                        let email = {
                                                            from: mailProps.username,
                                                            to: users,
                                                            subject: `${event.eventName} avlyst`,
                                                            text: `Arrangementet ${event.eventName} som du var artist og/eller personell ved har blitt avlyst.\nAll informasjon om arrangementet er fortsatt tilgjengelig i 90 dager etter at det skulle funnet sted\nDu kan finne arrangementet på ${url}${event.eventId}\n\nMed vennlig hilse\nHarmoni team 6`
                                                        };
                                                        mail.sendMail(email);
                                                        return response[0] === 1; /*affected rows === 1*/
                                                    })
                                            })
                                    })
                            } else {
                                return response[0] === 1; /*affected rows === 1*/
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            return false;
                        });
                }
            })
    }


    cancelEvent(eventId) {
        return model.EventModel.findAll({
            where: {eventId: eventId},
            include: [{
                model: model.UserModel
            }, {
                model: model.GigModel
            }, {
                model: model.PersonnelModel
            }]
        })
            .then(() => {
                return model.EventModel.update(
                    {
                        cancelled: true
                    },
                    {where: {eventId: eventId}})
                    .then(cancelled => cancelled[0] === 1 /*affected rows === 1*/)
                    .catch(error => {
                        console.error(error);
                        return false;
                    });
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

        if (!isCI && !test) {
            return this.getEventByEventId(eventId)
                .then(event => {
                    return this.getUserById(event.organizerId)
                        .then(user => {
                            return this.getGigs(eventId)
                                .then(gigs => gigs.map(gig => gig.dataValues.artistId))
                                .then(artistIds => {
                                    return this.getPersonnel(eventId)
                                        .then(personnel => personnel.map(person => person.dataValues.personnelId))
                                        .then(personnelIds => {
                                            let set = new Set(artistIds);
                                            personnelIds.map(person => set.add(person));
                                            return model.UserModel.findAll({where: {userId: {[op.in]: Array.from(set)}}})
                                                .then(users => users.map(user => user.dataValues.email))
                                                .then(users => {
                                                    let email = {
                                                        to: users,
                                                        from: mailProps.username,
                                                        subject: `Arrangement slettet: ${event.eventName}`,
                                                        text: `Arrangementet ${event.eventName}, som du var artist og/eller personell på, har blitt slettet.\nHvis du lurer på hvorfor, kan du ta kontakt med organisator ${user.username} på mail: ${user.email}\n\nMed vennlig hilsen\nHarmoni team 6`
                                                    };
                                                    return this.deleteGigs(eventId)
                                                        .then(() => {
                                                            return model.TicketModel.destroy({where: {eventId: eventId}})
                                                                .then(() => {
                                                                    return model.PersonnelModel.destroy({where: {eventId: eventId}})
                                                                        .then(() => {
                                                                            return model.EventModel.destroy({where: {eventId: eventId}})
                                                                                .then(res => {
                                                                                    mail.sendMail(email);
                                                                                    return res;
                                                                                });
                                                                        });
                                                                });
                                                        }).catch(error => {
                                                            console.error(error);
                                                            return false;
                                                        });
                                                });
                                        });
                                });
                        });
                });

        } else {
            return this.deleteGigs(eventId)
                .then(() => {
                    return model.TicketModel.destroy({where: {eventId: eventId}})
                        .then(() => {
                            return model.PersonnelModel.destroy({where: {eventId: eventId}})
                                .then(() => {
                                    return model.EventModel.destroy({where: {eventId: eventId}})
                                        .then(res => {
                                            return res;
                                        });
                                });
                        });
                }).catch(error => {
                    console.error(error);
                    return null;
                })
        }
    }

    /**
     * Delete all events with end time older than 90 days
     *
     * @returns {number}
     */
    deleteOldEvents() {
        return model.EventModel.findAll({where: {endTime: {[Op.lt]: moment().subtract(90, 'days').toDate()}}});
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
     * retrieves all events a user is artist or personnel
     *
     * @param userId
     * @returns {Promise<Event[]>}
     */
    async getMyEventsByUserId(userId) {
        let personnelEvents = await model.PersonnelModel.findAll({where: {personnelId: userId}})
            .catch(error => {
                console.error(error);
                return [];
            }).then(e => e.map(e => e.eventId));

        let artistEvents = await model.GigModel.findAll({where: {artistId: userId}})
            .catch(error => {
                console.error(error);
                return [];
            }).then(e => e.map(e => e.eventId));

        return model.EventModel.findAll({
            where: {
                [Op.or]: [
                    {eventId: artistEvents},
                    {eventId: personnelEvents}
                ]
            }
        })
            .catch(error => {
                console.error(error);
                return [];
            })


    }


    /**
     * retrieves the event by its ID
     *
     * @param eventId
     * @returns {Promise<{}>}
     */
    getEventByEventId(eventId) {
        return model.EventModel.findOne({where: {eventId: eventId}})
            .catch(error => {
                console.error(error);
                return {};
            });
    }


    /*
                            PERSONNEL
     */

    /**
     * adds personnel to an event, return
     *
     * @param personnel[]
     * @returns {Promise<boolean>}
     */
    addPersonnel(personnel) {
        return model.PersonnelModel.bulkCreate(personnel)
            .then(response => {
                if (!isCI && !test) {
                    this.getEventByEventId(response[0].eventId)
                        .then(event => {
                            this.getPersonnel(event.eventId)
                                .then(person => {
                                    person.map(pers => {
                                        let email = {
                                            from: mailProps.username,
                                            to: pers.user.email,
                                            subject: `Personellprivilegier for ${event.eventName}`,
                                            text: `Du har blitt lagt til som personell i arrangementet ${event.eventName} på ${url}\nDu kan finne arrangementet på ${url}arrangement/${event.eventId}\n\nMed vennlig hilsen\nHarmoni team 6`
                                        };
                                        mail.sendMail(email);
                                    })
                                });
                        });
                }
                return response[0]._options.isNewRecord
            })
            .catch(error => {
                console.error(error);
                return false;
            })
    }

    /**
     * Updates the role of personnel, cannot change event or person as these are the primary key
     *
     * @param personnel[]
     * @returns {Promise<boolean>}
     */
    updatePersonnel(personnel) {
        return Promise.all(personnel.map(person => model.PersonnelModel.update(
            {
                role: person.role
            },
            {where: {eventId: person.eventId, personnelId: person.personnelId}})))
            .then(() => {
                return true
            })
            .catch(error => {
                console.error(error);
                return false
            })
    }

    /**
     * Removes Personnel from an event
     *
     * @param eventId
     * @param personnelId
     */
    removePersonnel(eventId, personnelId) {
        return model.PersonnelModel.destroy(
            {where: {eventId: eventId, personnelId: personnelId}})
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
     * @param tickets[]
     * @returns {Promise<boolean>}
     */
    addTickets(tickets) {
        return model.TicketModel.bulkCreate(tickets)
            .then(response => response.id !== null)
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    /**
     * Updates a new Ticket in the Database, returns false if something goes wrong
     *
     * @param tickets: Ticket[]
     * @returns {Promise<boolean>}
     */
    updateTickets(tickets) {
        return Promise.all(tickets.map(ticket => model.TicketModel.update(
            {
                type: ticket.type,
                price: ticket.price,
                amount: ticket.amount
            },
            {where: {eventId: ticket.eventId, type: ticket.oldType}})
            .catch(error => {
                console.error(error);
                return false
            })))
            .then(() => {
                return true;
            });
    }

    /**
     * Removes and entry from the Tickets in the Database
     *
     * @param eventId
     * @param type
     */
    removeTicket(eventId, type) {
        return model.TicketModel.destroy({where: {eventId: eventId, type: type}})
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
        return model.FileModel.create(
            {
                name: gig.contract.name,
                data: gig.contract.data,
            })
            .then((created) => {
                return model.GigModel.create(
                    {
                        artistId: gig.artistId,
                        eventId: gig.eventId,
                        contract: created.fileId
                    })
                    .then(response => {
                        if (!isCI && !test) {
                            this.getUserById(gig.artistId)
                                .then(user => {
                                    this.getEventByEventId(gig.eventId)
                                        .then(event => {
                                            let email = {
                                                to: user.email,
                                                from: mailProps.username,
                                                subject: "Artistprivilegier for " + event.eventName,
                                                text: `Du har blitt lagt til som artist i arrangementet ${event.eventName} på ${url}\nDu kan finne arrangementet på ${url}arrangement/${event.eventId}\nFor å laste ned kontrakt eller legge til en rider må du logge inn på siden\n\nMed vennlig hilsen\nHarmoni team 6`
                                            };
                                            mail.sendMail(email);
                                        })
                                });
                        }
                        return response._options.isNewRecord
                    })
                    .catch(error => {
                        console.error(error);
                        return false;
                    })
            });

    }


    /**
     * retrieves the gig assosciated with an event, includes contract data and username/email of artist
     *
     * @param eventId
     * @returns {Promise<Gig[]>}
     */
    getGigs(eventId) {
        return model.GigModel.findAll({
            include: [
                {model: model.UserModel, attributes: ['username', 'email']},
            ],
            where: {eventId: eventId}
        })
            .catch(error => {
                console.error(error);
                return [];
            });
    }

    deleteGigs(eventId) {
        return model.GigModel.findAll({
            where: {eventId: eventId}
        }).catch(() => false)
            .then(gigs => {
                gigs.map(gig => {
                    model.FileModel.findByPk(gig.contract).catch(() => false)
                        .then(result => {
                            filehandler.deleteFromCloud(result.name, false);
                            return true;
                        })
                });
            });
    }

    /**
     * deletes a Gig and the assosciated contract/file from the database
     *
     * @param eventId
     * @param artistId
     * @returns {Promise<boolean>}
     */
    deleteGig(eventId, artistId) {
        return this.getContractId(eventId, artistId).then(contractId => {
            return model.FileModel.findByPk(contractId.dataValues.contract)
                .then(contract => {
                    filehandler.deleteFromCloud(contract.name, false);
                    return model.FileModel.destroy({where: {fileId: contractId}}).then(() => {
                        return this.deleteRiderItems(eventId, artistId).then(() => {
                            return model.GigModel.destroy({
                                where: {
                                    eventId: eventId,
                                    artistId: artistId
                                }
                            }).then(() => true)
                        })
                    })
                })
        })
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    getContractId(eventId, artistId) {
        return model.GigModel.findOne({
            where: {eventId: eventId, artistId: artistId},
            attributes: ["contract"]
        }).catch(error => console.error(error));
    }

    getContract(eventId, artistId) {
        return this.getContractId(eventId, artistId).then((gig) => {
            return model.FileModel.findOne({
                where: {fileId: gig.contract}
            })
        }).catch(error => console.error(error));
    }

    /**
     * retrieves the gig assosciated with an event, includes contract data and username/email of artist
     *
     * @param riderItems[]
     * @returns {Promise<boolean>}
     */
    addRiderItems(riderItems) {
        return model.RiderModel.bulkCreate(riderItems)
            .then(response => {
                if (!isCI && !test) {
                    return model.EventModel.findOne({
                        where: {eventId: riderItems[0].eventId},
                        include: [{model: model.UserModel}]
                    })
                        .then(res => {
                            let email = {
                                to: res.user.dataValues.email,
                                from: mailProps.username,
                                subject: `Rider oppdatert for ${res.dataValues.eventName}`,
                                text: `En artist har oppdatert sin rider for ${res.dataValues.eventName}.\nGå inn på ${url}arrangement/${res.dataValues.eventId} for å se og godkjenne rider\n\n Med vennlig hilsen\nHarmoni team 6`
                            };
                            mail.sendMail(email);
                            return response[0].dataValues.item !== null
                        });
                } else {
                    return response[0].dataValues.item !== null;
                }
            })
            .catch(error => {
                console.error(error);
                return false;
            })
    }


    /**
     * retrieves the gig assosciated with an event, includes contract data and username/email of artist
     *
     * @param riderItems: RiderItem[]
     * @returns {Promise<boolean>}
     */
    updateRiderItems(riderItems) {
        return Promise.all(riderItems.map(riderItem => model.RiderModel.update(
            {
                confirmed: riderItem.confirmed
            },
            {
                where: {
                    eventId: riderItem.eventId,
                    artistId: riderItem.artistId,
                    item: riderItem.item
                }
            })
            .catch(error => {
                console.error(error);
                return false
            })))
            .then(() => {
                if (!isCI && !test) {
                    return this.getUserById(riderItems[0].artistId)
                        .then(user => {
                            return model.EventModel.findOne({
                                where: {eventId: riderItems[0].eventId},
                                include: [{model: model.UserModel}]
                            })
                                .then(event => {
                                    let email = {
                                        to: user.dataValues.email,
                                        from: mailProps.username,
                                        subject: `Rider gjennomgått for ${event.dataValues.eventName}`,
                                        text: `${event.user.dataValues.username} har gått gjennom din rider for arrangementet ${event.dataValues.eventName}\n\nDu kan se hva hvilke punkter arrangøren har godkjent eller ikke godkjent ved å gå inn på arrangementet: ${url}arrangement/${event.dataValues.eventId}\n\nDu kan ta kontakt med arrangøren på mail: ${event.user.dataValues.email}\n\nMed vennlig hilsen\nHarmoni team 6`
                                    };
                                    mail.sendMail(email);
                                    return true;
                                });
                        });
                } else {
                    return true;
                }
            });
    }

    /**
     * retrieves the gig assosciated with an event, includes contract data and username/email of artist
     *
     * @param eventId
     * @param artistId
     * @param item
     * @returns {Promise<boolean>}
     */
    deleteRiderItem(eventId, artistId, item) {
        return model.RiderModel.destroy({where: {eventId: eventId, artistId: artistId, item: item}})
            .then(() => true)
            .catch(error => {
                console.error(error);
                return false;
            })
    }

    /**
     * retrieves the gig assosciated with an event, includes contract data and username/email of artist
     *
     * @param eventId
     * @param artistId
     * @returns {Promise<boolean>}
     */
    deleteRiderItems(eventId, artistId) {
        return model.RiderModel.destroy({where: {eventId: eventId, artistId: artistId}})
            .then(() => true)
            .catch(error => {
                console.error(error);
                return false;
            })
    }


    /**
     * retrieves the rideritems assosciated with a gig
     *
     * @param eventId
     * @param artistId
     * @returns {Promise<Gig[]>}
     */
    getRiderItems(eventId, artistId) {
        return model.RiderModel.findAll({where: {eventId: eventId, artistId: artistId}})
            .catch(error => {
                console.error(error);
                return [];
            });
    }


    /*
                         🐞 BUG STUFF 🐛
     */

    createBug(body) {
        return model.BugModel.create({
            email: body.email,
            username: body.username,
            subject: body.subject,
            bugText: body.text
        })
            .then(res => res.bugId !== null)
            .catch(error => {
                console.error(error);
                return false;
            });
    }
}

module.exports = Dao;


