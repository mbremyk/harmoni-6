const Models = require('../model.js');
const dao = require('../dao.js');

let db = new dao();

beforeEach(done => Models.syncTestData().then(() => done()));

/*
                            USERS
 */

describe('Login', () => {
    it('loginOk - fail - wrong password', done => {
        db.loginOk('steffen@mail.com', 'FeilPassord').then(ok => {
            expect(ok).toBeFalsy();
            done();
        });
    });

    it('loginOk - fail - email doesnt exist', done => {
        db.loginOk('finnesIkke@mail.com', 'ST').then(ok => {
            expect(ok).toBeFalsy();
            done();
        });
    });


    it('loginOk - success on correct password', done => {
        db.loginOk('steffen@mail.com', 'ST').then(ok => {
            expect(ok).toBeTruthy();
            done();
        });
    });
});


describe('Users', () => {

    it('createUser', done => {
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

    it('updateUser - success', done => {
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

    it('updateUser - fail', done => {
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

    it('deleteUser', done => {
        db.deleteUser(5).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('deleteOneTimeLogin', done => {
        db.deleteOneTimeLogin('steffen@mail.com').then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('forgotPassword', done => {
        db.forgotPassword('steffen@mail.com').then(response => {
            expect(response).not.toBeNull();
            done();
        });
    });

    it('oneTimeLogin', done => {
        db.onetimeLogin('steffen@mail.com', 'temp').then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('getAllUsers', done => {
        db.getAllUsers().then(users => {
            expect(users.length).toBe(9);
            done();
        });
    });


    it('getUserByEmail', done => {
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

    it('getSaltByEmail', done => {
        db.getSaltByEmail('steffen@mail.com')
            .then(salt => {
                expect(salt[0].dataValues)
                    .toEqual({salt: '$2a$10$Hii2jl8XwvMHwDcB.kSrt.'});
                done();
            });
    });

    it('getUserByID', done => {
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

    it('getUserByEmailOrUsername', done => {
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

    it('createEvent', done => {
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

    it('getEventsByOrganizerId', done => {
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

    it('getMyEventsByUserId', done => {
        db.getMyEventsByUserId(2)
            .then(events => {
                expect(events.map(event => event.toJSON())
                    .map(event => ({
                        eventId: event.eventId,
                        organizerId: event.organizerId,
                        eventName: event.eventName,
                        address: event.address,
                        ageLimit: event.ageLimit,
                    }))).toEqual([
                    {
                        eventId: 3,
                        organizerId: 7, //Sivert
                        eventName: 'D.D.E',
                        address: 'Festningen',
                        ageLimit: 18,
                    }
                ]);
                done();
            });
    });

    it('getEventsByEventId', done => {
        db.getEventByEventId(1)
            .then(event => {
                expect({
                    eventId: event.eventId,
                    organizerId: event.organizerId,
                    eventName: event.eventName,
                    address: event.address,
                    ageLimit: event.ageLimit,
                }).toEqual({
                    eventId: 1,
                    organizerId: 9, //Sabine
                    eventName: 'Fredagsquiz',
                    address: 'Ikke en faktisk addresse 1',
                    ageLimit: 0,
                });
                done();
            });
    });

    it('updateEvent - success', done => {
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


    it('updateEvent - fail', done => {
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

    it('cancelEvent', done => {
        db.cancelEvent(1)
            .then(res => {
                expect(res).toBeTruthy();
                done();
            });
    });

    it('deleteEvent', done => {
        db.deleteEvent(2).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });


    it('getAllEvents', done => {
        db.getAllEvents().then(events => {
            expect(events.length).toBe(5);
            done();
        });
    });
});

describe('Events - search', () => {
    it('getEventsMatching - several results', done => {
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


    it('getEventsMatching - one result', done => {
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


    it('getEventsMatching - no results', done => {
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
    it('addPersonnel', done => {
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

    it('updatePersonnel', done => {
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

    it('removePersonnel', done => {
        db.removePersonnel(5, 3).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('getPersonnel', done => {
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
    it('addTickets', done => {
        let tickets = [{
            eventId: 4,
            type: 'CREATED',
            price: 69,
            amount: 69,

        }];
        db.addTickets(tickets).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('updateTickets', done => {
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

    it('removeTicket', done => {
        db.removeTicket(1, 'Inngang').then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('getTickets', done => {
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
    it('addGig', done => {
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

    it('getContract', done => {
        db.getContract(2, 5).then(contract => {
            expect(contract.map(contract =>
                contract.toJSON()).map(contract => (
                {
                    name: contract.name,
                    data: contract.data
                }
            ))).toEqual([
                {
                    name: 'Fil 2',
                    data: 'DATA'
                }
            ]);
        });
        done();
    });

    it('deleteGig', done => {
        db.deleteGig(2, 5).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('getGigs', done => {
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
});


describe('RiderItems', () => {
    it('addRiderItems', done => {
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

    it('deleteRiderItem', done => {
        db.deleteRiderItem(2, 5, 'Sigg').then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('updateRiderItems', done => {
        let items = [
            {
                artistId: 5, //Magnus
                eventId: 2, //Ungdomskonert
                item: 'Litt Sjokolade hadde vært fint',
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
                item: 'Varm Cola',
                confirmed: true
            }];
        db.updateRiderItems(items).then(updateOk => {
            expect(updateOk).toBeTruthy();
            done();
        });
    });

    it('getRiderItems', done => {
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


describe('Bugs', () => {
    it('Create Bug', done => {
        let bug = {
            email: 'test@mail.com',
            username: 'testUser',
            subject: 'new bug',
            bugText: 'it doesnt work'
        };
        db.createBug(bug).then(res => {
            expect(res).toBeTruthy();
        });
        done();
    });
});
