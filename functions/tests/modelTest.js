const Models = require('../model.js');
const dao = require('../dao.js');

let db = new dao();

beforeEach(done => Models.syncTestData().then(() => done()));

/*
                            USERS
 */

describe('Login', () => {
    it('Login Fail on wrong password', done => {
        db.loginOk('steffen@mail.com', 'FeilPassord').then(ok => {
            expect(ok).toBeFalsy();
            done();
        });
    });


    it('Login Success on correct password', done => {
        db.loginOk('steffen@mail.com', 'ST').then(ok => {
            expect(ok).toBeTruthy();
            done();
        });
    });
});


describe('Users', () => {

    it('create user', done => {
        let user = {
            username: 'TestBrukerCreated',
            password: 'Passord',
            salt: ':(',
            email: '7@mail.com'
        };
        db.createUser(user).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('update user success', done => {
        let user = {
            userId: '6',
            username: 'UPDATED',
            password: 'UPDATED',
            email: 'NEW@mail.com'
        };
        db.updateUser(user).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('update user fail - id doesnt exist', done => {
        let user = {
            userId: '-1',
            username: 'FAIL',
            password: 'FAIL',
            salt: 'FAIL',
            email: 'FAIL'
        };
        db.updateUser(user).then(response => {
            expect(response).toBeFalsy();
            done();
        });
    });

    it('delete user', done => {
        db.deleteUser(5).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('correct data in users', done => {
        db.getAllUsers().then(users => {
            expect(users.length).toBe(9);
            done();
        });
    });


    it('find user by email', done => {
        db.getUserByEmail("steffen@mail.com").then(user => {
            expect({
                userId: user.userId,
                username: user.username,
                email: user.email,
            }).toEqual({
                    userId: 1,
                    username: 'Steffen T',
                    email: 'steffen@mail.com'
                }
            );
            done();
        });
    });

    it('finds salt by email', done => {
        db.getSaltByEmail('steffen@mail.com')
            .then(salt => {
                expect(salt[0].dataValues)
                    .toEqual({salt: 'salt'});
                done();
            });
    });

    it('find user by ID', done => {
        db.getUserById(1).then(user => {
            expect({
                userId: user.userId,
                username: user.username,
                email: user.email,
            }).toEqual({
                    userId: 1,
                    username: 'Steffen T',
                    email: 'steffen@mail.com'
                }
            );
            done();
        });
    });

    it('finds user by email or username', done => {
        db.getUserByEmailOrUsername('steffen@mail.com', 'Marius T')
            .then(users => {
                expect([{
                    userId: users[0].dataValues.userId,
                    username: users[0].dataValues.username,
                    email: users[0].dataValues.email
                }, {
                    userId: users[1].dataValues.userId,
                    username: users[1].dataValues.username,
                    email: users[1].dataValues.email
                }])
                    .toEqual([{
                        userId: 1,
                        username: 'Steffen T',
                        email: 'steffen@mail.com'
                    }, {
                        userId: 2,
                        username: 'Marius T',
                        email: 'marius@mail.com'
                    }]);
                done();
            });
    });
});

/*
                    EVENTS
 */


describe('Events', () => {

    it('create event', done => {
        let event = {
            organizerId: 1,
            eventName: 'CREATE TEST',
            city: 'Trondheim',
            address: 'Torget 2',
            placeDescription: '3 etasje',
            ageLimit: 12,
            startTime: null,
            endTime: null,
            imageUrl: 'fake URL',
            description: 'Create event test',
        };
        db.createEvent(event).then(response => {
            expect(response.insertId).toBe(6);
            done();
        });
    });

    it('finds events by organizerId', done => {
        db.getEventsByOrganizerId(2)
            .then(events => {
                expect(events).toHaveLength(2);
                expect(events.map(event => event.toJSON())
                    .map(event => ({
                        eventId: event.eventId,
                        organizerId: event.organizerId,
                        eventName: event.eventName,
                        address: event.address,
                        ageLimit: event.ageLimit,
                        startTime: event.startTime,
                        endTime: event.endTime,
                    }))).toEqual([
                    {
                        eventId: 4,
                        organizerId: 2, //Marius
                        eventName: 'Kygokonsert på torget',
                        address: 'Trondheim torg',
                        ageLimit: 0,
                        startTime: 'Invalid date',
                        endTime: 'Invalid date'
                    },
                    {
                        eventId: 5,
                        organizerId: 2, //Marius
                        eventName: 'Mandagsfylla',
                        address: 'Sukkerhuset',
                        ageLimit: 21,
                        startTime: 'Invalid date',
                        endTime: 'Invalid date'
                    }
                ]);
                done();
            });
    });

    it('finds event by eventId', done => {
        db.getEventByEventId(1)
            .then(event => {
                expect({
                    eventId: event.eventId,
                    organizerId: event.organizerId,
                    eventName: event.eventName,
                    address: event.address,
                    ageLimit: event.ageLimit,
                    startTime: event.startTime,
                    endTime: event.endTime,
                }).toEqual({
                    eventId: 1,
                    organizerId: 9, //Sabine
                    eventName: 'Fredagsquiz',
                    address: 'Ikke en faktisk addresse 1',
                    ageLimit: 0,
                    startTime: 'Invalid date',
                    endTime: 'Invalid date'
                });
                done();
            });
    });

    it('update event success', done => {
        let event = {
            eventId: 5,
            organizerId: 7,
            eventName: 'KANSELLERT',
            address: 'KANSELLERT',
            ageLimit: 18,
            description: 'UPDATED'
        };
        db.updateEvent(event).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });


    it('update event fail', done => {
        let event = {
            eventId: '-1',
            organizerId: '2',
            eventName: 'UpdateEventFailTest',
            address: 'event.address',
            ageLimit: '20',
            description: 'EVENT UPDATED'
        };
        db.updateEvent(event).then(response => {
            expect(response).toBeFalsy();
            done();
        });
    });

    it('cancels event', done => {
        db.cancelEvent(1)
            .then(res => {
                expect(res).toBeTruthy();
                done();
            });
    });

    it('delete Event', done => {
        db.deleteEvent(2).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });


    it('correct data in events', done => {
        db.getAllEvents().then(events => {
            expect(events.length).toBe(5);
            done();
        });
    });
});

describe('Events - search', () => {
    it('search several results', done => {
        db.getEventsMatching('konsert').then(events => {
            expect(events.length).toBe(3);
            expect(events.map(event =>
                event.toJSON()).map(event => (
                {
                    eventName: event.eventName,
                }
            ))).toEqual([
                {
                    eventName: 'Ungdomskonsert',
                },
                {
                    eventName: 'D.D.E',
                },
                {
                    eventName: 'Kygokonsert på torget',
                }
            ]);
            done();
        });
    });


    it('search one results', done => {
        db.getEventsMatching('Kygo').then(events => {
            expect(events.length).toBe(1);
            expect({
                eventName: events[0].eventName,
            }).toEqual({
                eventName: 'Kygokonsert på torget',
            });
            done();
        });
    });


    it('search with no results', done => {
        db.getEventsMatching('Finnes ikke').then(events => {
            expect(events.length).toBe(0);
            done();
        });
    });
});


/*
                    PERSONNEL
 */


describe('Personnel', () => {
    it('add personnel[] to event', done => {
        let personnel = [
            {
                eventId: 1,
                personnelId: 1,
                role: 'ADD'
            },
            {
                eventId: 2,
                personnelId: 2,
                role: 'ADD2'
            }];
        db.addPersonnel(personnel).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('update personnel', done => {
        let personnel = [{
            eventId: 2,
            personnelId: 4,
            role: 'UPDATED'
        }];
        db.updatePersonnel(personnel).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('remove personnel', done => {
        db.removePersonnel(5, 3).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('correct data in personnel', done => {
        db.getPersonnel(4).then(personnel => {
            expect(personnel.length).toBe(2);
            expect(personnel.map(personnel =>
                personnel.toJSON()).map(personnel => (
                {
                    personnelId: personnel.personnelId,
                    eventId: personnel.eventId,
                    role: personnel.role,
                    email: personnel.user.email,
                    username: personnel.user.username,
                }
            ))).toEqual([
                {
                    personnelId: 7, //Sivert
                    eventId: 4, //Kygokonsert
                    role: 'Lys',
                    email: 'sivert@mail.com',
                    username: 'Sivert U',
                },
                {
                    personnelId: 8, //Michael
                    eventId: 4, //Kygokonsert
                    role: 'Sikkerhet',
                    email: 'michael@mail.com',
                    username: 'Michael S.L',
                },
            ]);
            done();
        });
    });
})
;


/*
                TICKETS
 */


describe('Tickets', () => {
    it('create Ticket', done => {
        let ticket = {
            eventId: 4,
            type: 'CREATED',
            price: 69,
            amount: 69,

        };
        db.addTickets(ticket).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('update Ticket', done => {
        let tickets = [{
            eventId: 4,
            type: 'Golden Circle',
            price: 1234,
            amount: 56,
        }];
        db.updateTickets(tickets).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('remove Ticket', done => {
        db.removeTicket(1, 'Inngang').then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('correct data in tickets', done => {
        db.getTickets(4).then(tickets => {
            expect(tickets.length).toBe(3);
            done();
        });
    });
});


/*
                    GIGS
 */


describe('Gigs', () => {
    it('create Gig', done => {
        let gig = {
            eventId: 1,
            artistId: 2,
            contract: "TEST",
        };
        db.addGig(gig).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('correct data in gig', done => {
        db.getGigs(2).then(gigs => {
            expect(gigs.map(gig =>
                gig.toJSON()).map(gig => (
                {
                    eventId: gig.eventId,
                    artistId: gig.artistId,
                    artistName: gig.user.username,
                }
            ))).toEqual([
                {
                    eventId: 2,
                    artistId: 5,
                    artistName: 'Magnus B',
                }
            ]);
        });
        done();
    });


    it('add riderItem', done => {
        let item = [{
            eventId: 2,
            artistId: 5,
            item: "TEST"
        }];
        db.addRiderItems(item).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });


    it('update riderItems', done => {
        let items = [
            {
                artistId: 5, //Magnus
                eventId: 2, //Ungdomskonert
                item: 'Varm Cola',
                confirmed: true
            },
            {
                artistId: 5, //Magnus
                eventId: 2, //Ungdomskonert
                item: 'Sigg',
                confirmed: true
            },
            {
                artistId: 5, //Magnus
                eventId: 2, //Ungdomskonert
                item: 'Nakkepute',
                confirmed: true
            },
            {
                artistId: 5, //Magnus
                eventId: 2, //Ungdomskonert
                item: 'Litt Sjokolade hadde vært fint',
                confirmed: true
            }];
        db.updateRiderItems(items).then(updateOk => {
            expect(updateOk).toBeTruthy();
            done();
        });
    });

    it('correct riderItems', done => {
        db.getRiderItems(2, 5).then(items => {
            expect(items.length).toBe(4);
            expect(items.map(item =>
                item.toJSON()).map(item => (
                {
                    eventId: item.eventId,
                    artistId: item.artistId,
                    item: item.item
                }
            ))).toEqual([
                {
                    artistId: 5, //Magnus
                    eventId: 2, //Ungdomskonert
                    item: 'Varm Cola',
                    confirmed: null
                },
                {
                    artistId: 5, //Magnus
                    eventId: 2, //Ungdomskonert
                    item: 'Sigg',
                    confirmed: true
                },
                {
                    artistId: 5, //Magnus
                    eventId: 2, //Ungdomskonert
                    item: 'Nakkepute',
                    confirmed: false
                },
                {
                    artistId: 5, //Magnus
                    eventId: 2, //Ungdomskonert
                    item: 'Litt Sjokolade hadde vært fint',
                    confirmed: true
                }
            ]);
        });
        done();
    });
});

