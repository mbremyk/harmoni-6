const Models = require('../model.js');
const dao = require('../dao.js');

let db = new dao();


beforeEach(done => Models.syncTestData().then(res => {
    done();
}));


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
                        imageUrl: event.imageUrl,
                        image: event.image,
                        description: event.description
                    }))).toEqual([
                    {
                        eventId: 4,
                        organizerId: 2, //Marius
                        eventName: 'Kygokonsert på torget',
                        address: 'Trondheim torg',
                        ageLimit: 0,
                        startTime: 'Invalid date',
                        endTime: 'Invalid date',
                        imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
                        image: null,
                        description: 'Aliquet enim tortor at auctor urna nunc id cursus. Integer eget aliquet nibh praesent tristique ' +
                            'magna. Consectetur adipiscing elit ut aliquam purus sit. Congue nisi vitae suscipit tellus mauris a diam ' +
                            'maecenas. Nulla malesuada pellentesque elit eget gravida cum sociis. Non quam lacus suspendisse faucibus ' +
                            'interdum posuere lorem ipsum. Aliquam sem et tortor consequat id porta. Ac tortor dignissim convallis aenean ' +
                            'et tortor. Convallis a cras semper auctor. Vel turpis nunc eget lorem dolor sed. Eget magna fermentum iaculis ' +
                            'eu non diam phasellus. Sagittis vitae et leo duis ut diam. Volutpat est velit egestas dui id ornare arcu.\n' +
                            '\n' +
                            'Sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque. Sed viverra ipsum nunc aliquet. ' +
                            'Eget aliquet nibh praesent tristique magna sit amet. Nunc lobortis mattis aliquam faucibus purus in. At ' +
                            'imperdiet dui accumsan sit amet nulla facilisi. Iaculis at erat pellentesque adipiscing commodo elit at ' +
                            'imperdiet dui. Et magnis dis parturient montes nascetur. Ac auctor augue mauris augue neque gravida in. Sagittis ' +
                            'id consectetur purus ut. Pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus. Viverra ' +
                            'aliquet eget sit amet.\n' +
                            '\n' +
                            'Vitae tempus quam pellentesque nec nam aliquam sem et tortor. Nam aliquam sem et tortor consequat id. Senectus ' +
                            'et netus et malesuada. Aliquam vestibulum morbi blandit cursus. Feugiat vivamus at augue eget arcu dictum ' +
                            'varius duis. Donec massa sapien faucibus et. Nulla pellentesque dignissim enim sit amet. Urna porttitor rhoncus ' +
                            'dolor purus. Bibendum arcu vitae elementum curabitur vitae. Erat nam at lectus urna duis convallis convallis ' +
                            'tellus. Diam maecenas sed enim ut sem viverra. Diam quis enim lobortis scelerisque fermentum dui. Fringilla est ' +
                            'ullamcorper eget nulla. Nisi lacus sed viverra tellus in hac habitasse platea. Non sodales neque sodales ut ' +
                            'etiam sit. Feugiat in fermentum posuere urna nec tincidunt.'
                    },
                    {
                        eventId: 5,
                        organizerId: 2, //Marius
                        eventName: 'Mandagsfylla',
                        address: 'Sukkerhuset',
                        ageLimit: 21,
                        startTime: 'Invalid date',
                        endTime: 'Invalid date',
                        imageUrl: 'https://vulkanoslo.no/wp-content/uploads/2019/04/barvulkan_3.jpg',
                        image: null,
                        description: 'non pulvinar neque laoreet suspendisse interdum. Ullamcorper velit sed ullamcorper morbi tincidunt. ' +
                            'Pellentesque adipiscing commodo elit at imperdiet dui accumsan. Dolor sit amet consectetur adipiscing elit ' +
                            'duis. Porttitor leo a diam sollicitudin. Tempus egestas sed sed risus. Magna sit amet purus gravida quis ' +
                            'blandit turpis. Enim eu turpis egestas pretium aenean pharetra magna ac placerat. At lectus urna duis ' +
                            'convallis convallis. Sit amet tellus cras adipiscing enim eu turpis egestas pretium. Tincidunt id aliquet ' +
                            'risus feugiat in ante.\n' +
                            '\n' +
                            'Aliquet enim tortor at auctor urna nunc id cursus. Integer eget aliquet nibh praesent tristique magna. ' +
                            'Consectetur adipiscing elit ut aliquam purus sit. Congue nisi vitae suscipit tellus mauris a diam maecenas. ' +
                            'Nulla malesuada pellentesque elit eget gravida cum sociis. Non quam lacus'
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
                    imageUrl: event.imageUrl,
                    image: event.image,
                    description: event.description
                }).toEqual({
                    eventId: 1,
                    organizerId: 9, //Sabine
                    eventName: 'Fredagsquiz',
                    address: 'Ikke en faktisk addresse 1',
                    ageLimit: 0,
                    startTime: 'Invalid date',
                    endTime: 'Invalid date',
                    imageUrl: 'https://images.readwrite.com/wp-content/uploads/2019/08/Why-You-Love-Online-Quizzes-825x500.jpg',
                    image: null,
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' +
                        'labore et dolore magna aliqua. Ultricies integer quis auctor elit. In est ante in nibh mauris cursus ' +
                        'mattis molestie a. Dictumst quisque sagittis purus sit amet. Turpis egestas maecenas pharetra convallis ' +
                        'posuere. Urna neque viverra justo nec ultrices. Sed odio morbi quis commodo odio aenean sed. Donec ' +
                        'pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Sem et tortor consequat id porta nibh ' +
                        'venenatis. Tincidunt id aliquet risus feugiat in ante metus dictum at. Cursus turpis massa tincidunt ' +
                        'dui ut ornare. Faucibus nisl tincidunt eget nullam non nisi. Ultricies integer quis auctor elit. Urna ' +
                        'et pharetra pharetra massa massa ultricies mi.'
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
            startTime: null,
            endTime: null,
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
    it('add personnel[] to event', done => {
        let personnel = [
            {
                eventId: 1,
                personnelId: 1,
                rider: null,
                contract: null
            },
            {
                eventId: 2,
                personnelId: 2,
                rider: null,
                contract: null
            }];
        db.addPersonnel(personnel).then(response => {
            expect(response).toBeTruthy();
            done();
        });
    });

    it('update personnel', done => {
        let personnel = {
            eventId: 2,
            personnelId: 4,
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
            expect(gigs.length).toBe(1);
            expect(gigs.map(gig =>
                gig.toJSON()).map(gig => (
                {
                    eventId: gig.eventId,
                    artistId: gig.artistId,
                    artistName: gig.user.username,
                    contract: gig.file.name,
                    contractData: gig.file.data
                }
            ))).toEqual([
                {
                    eventId: 2,
                    artistId: 5,
                    artistName: 'Michael S.L',
                    contract: 'Fil 2',
                    contractData: 'Lorem var en dårlig idé'
                }
            ]);
        });
        done();
    });
});


describe('Files', () => {

});

describe('Proving math', () => {
    it('1+1=2', done => {
        expect(1 + 1).toBe(2);
        done();
    });
});

