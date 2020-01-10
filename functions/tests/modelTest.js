const Models = require('../model.js');
const dao = require('../dao.js');
let db = new dao();



beforeAll(() => Models.syncTestData());



describe('Login Test', () =>
{
	it('Login Fail on wrong password', done =>
	{
		expect(db.loginOk('TestBruker1', 'FeilPassord')).toBeFalsy();
		done();
	});



	it('Login Success on correct password', done =>
	{
		expect(db.loginOk('TestBruker1', 'TestBruker1')).toBeTruthy();
		done();
	});
});





describe('User Tests', () =>
{
	it('correct data in users', done =>
	{
		db.getAllUsers().then(users =>
		{
			expect(users.length).toBeGreaterThanOrEqual(9);
			done();
		});
	});



	it('find user by id and username', done =>
	{
		db.getUser(1, 'Steffen T').then(users =>
		{
			expect(users
				.map(user => user.toJSON())
				.map(user => (
					{
						userId: user.userId,
						username: user.username,
						password: user.password,
						salt: user.salt,
						email: user.email,

					})))
				.toEqual([
					{
						userId: 1,
						username: 'Steffen T',
						password: 'ST',
						salt: 'salt',
						email: 'steffen@mail.com'
					}
				]);
			done();
		});
	});



	it('create user', done =>
	{
		let user = {username: 'TestBrukerCreated', password: 'Passord', salt: ':(', email: '7@mail.com'};
		db.createUser(user).then(response =>
		{
			expect(response).toBeTruthy();
			done();
		});
	});



	it('update user success', done =>
	{
		let user = {
			userId: '1',
			username: 'UsernameUpdated',
			password: 'PasswordUpdated',
			salt: ':)',
			email: 'NEW@mail.com'
		};
		db.updateUser(user).then(response =>
		{
			expect(response).toBeTruthy();
			done();
		});
	});



	it('update user fail', done =>
	{
		let user = {
			userId: '-1',
			username: 'FAIL',
			password: 'FAIL',
			salt: 'FAIL',
			email: 'FAIL'
		};
		db.updateUser(user).then(response =>
		{
			expect(response).toBeFalsy();
			done();
		});
	});
});





describe('Event Tests', () =>
{
	it('correct data in events', done =>
	{
		db.getAllEvents().then(events =>
		{
			expect(events.length).toBeGreaterThanOrEqual(5);
			done();
		});
	});



	it('create event', done =>
	{
		let event = {
			organizerId: '3',
			eventName: 'CreateEvent',
			address: 'event.address,',
			ageLimit: '45',
			startTime: null,
			endTime: null,
			description: 'if you can see this the event was created properly'
		};
		db.createEvent(event).then(response =>
		{
			console.log(response);
			expect(response.insertId).toEqual(6);
			done();
		});
	});



	it('update event success', done =>
	{
		let event = {
			eventId: 2,
			organizerId: 7,
			eventName: 'KANSELLERT',
			address: 'KANSELLERT',
			ageLimit: 18,
			startTime: null,
			endTime: null,
			imageUrl: 'https://www.bakgaarden.no/wp-content/uploads/2019/08/DDE-1-crop%C2%A9LineBerre-1030x686.jpg',
			description: 'UPDATED'
		};
		db.updateEvent(event).then(response =>
		{
			expect(response).toBeTruthy();
			done();
		});
	});



	it('update event fail', done =>
	{
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
		db.updateEvent(event).then(response =>
		{
			expect(response).toBeFalsy();
			done();
		});
	});
});





describe('Personnel Tests', () =>
{
	it('correct data in personnel', done =>
	{
		db.getPersonnel(4).then(personnel =>
		{
			expect(personnel.length).toBe(2);
			done();
		});
	});



	it('add personnel to event', done =>
	{
		db.addPersonnel(1, 1, 'JEG VIL JOBBE').then(response =>
		{
			expect(response).toBeTruthy();
			done();
		});
	});
});





describe('Search', () =>
{
	it('search several results', done =>
	{
		db.findEventsBySearch('konsert').then(events =>
		{
			events.map(event => console.log(event));
			expect(events
				.map(event => event.toJSON())
				.map(event => (
					{
						eventName: event.eventName,
					})))
				.toEqual([
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



	it('search one results', done =>
	{
		db.findEventsBySearch('Kygo').then(events =>
		{
			expect(events
				.map(event => event.toJSON())
				.map(event => (
					{
						eventName: event.eventName,
					})))
				.toEqual([
					{
						eventName: 'Kygokonsert på torget',
					}
				]);
			done();
		});
	});



	it('search with no results', done =>
	{
		db.findEventsBySearch('Finnes ikke').then(events =>
		{

			expect(events).toBe(null);
			done();
		});
	});
});





describe('Uncategorized', () =>
{
	it('1+1=2', done =>
	{
		expect(1 + 1).toBe(2);
		done();
	});



	it('correct data in gigs', done =>
	{
		db.getGig(4).then(gig =>
		{
			expect(gig.length).toBe(1);
			done();
		});
	});



	it('correct data in tickets', done =>
	{
		db.getTickets(4).then(tickets =>
		{
			expect(tickets.length).toBe(3);
			done();
		});
	});
});

