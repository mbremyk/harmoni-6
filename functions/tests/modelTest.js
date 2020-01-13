const Models = require('../model.js');
const dao = require('../dao.js');
let db = new dao();


beforeAll(() => Models.syncTestData().then(() => function(){}));


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
            userId: '7',
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

    it('correct data in users', done => {
        db.getAllUsers().then(users => {
            expect(users.length).toBeGreaterThanOrEqual(9);
            done();
        });
    });


    it('find user by email', done => {
        db.getUserByEmail("steffen@mail.com").then(user => {
            expect({
                userId: user.userId,
                username: user.username,
                password: user.password,
                salt: user.salt,
                email: user.email,
            }).toEqual({
                    userId: 1,
                    username: 'Steffen T',
                    password: 'ST',
                    salt: 'salt',
                    email: 'steffen@mail.com'
                }
            );
            done();
        });
    });

    it('find user by ID', done => {
        db.getUserById(1).then(user => {
            expect({
                userId: user.userId,
                username: user.username,
                password: user.password,
                salt: user.salt,
                email: user.email,
            }).toEqual({
                    userId: 1,
                    username: 'Steffen T',
                    password: 'ST',
                    salt: 'salt',
                    email: 'steffen@mail.com'
                }
            );
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
            organizerId: '3',
            eventName: 'CREATED',
            address: 'CREATED',
            ageLimit: '45',
            startTime: null,
            endTime: null,
            description: 'if you can see this the event was created properly'
        };
        db.createEvent(event).then(response => {
            expect(response.insertId).toEqual(6);
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
            startTime: null,
            endTime: null,
            description: 'EVENT UPDATED'
        };
        db.updateEvent(event).then(response => {
            expect(response).toBeFalsy();
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
            expect(events.length).toBeGreaterThanOrEqual(5);
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
    it('add personnel to event', done => {
        let personnel = {
            eventId: 1,
            personnelId: 1,
            role: 'JEG VIL JOBBE'
        };
        db.addPersonnel(personnel).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('update personnel', done => {
        let personnel = {
            eventId: 4,
            personnelId: 8,
            role: 'UPDATED'
        };
        db.updatePersonnel(personnel).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('remove personnel', done => {
        let personnel = {
            eventId: 5,
            personnelId: 3,
            role: 'DELETE'
        };
        db.removePersonnel(personnel).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('correct data in personnel', done => {
        db.getPersonnel(4).then(personnel => {
            expect(personnel.length).toBe(2);
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
            contract: null,
            rider: null,
        };
        db.addGig(gig).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('correct data in gig', done => {
        db.getGig(4).then(gig => {
            expect(gig.artistId).toBe(8);
            done();
        });
    });
});


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
        db.addTicket(ticket).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('update Ticket', done => {
        let ticket = {
            eventId: 4,
            type: 'Golden Circle',
            price: 1234,
            amount: 56,
        };
        db.updateTicket(ticket).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('remove Ticket', done => {
        let ticket = {
            eventId: 1,
            type: 'Inngang',
            price: 50,
            amount: 40,
        };
        db.removeTicket(ticket).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('correct data in tickets', done => {
        db.getTickets(4).then(tickets => {
            expect(tickets.length).toBeGreaterThanOrEqual(3);
            done();
        });
    });
});


describe('Uncategorized', () => {
    it('1+1=2', done => {
        expect(1 + 1).toBe(2);
        done();
    });
});

