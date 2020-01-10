const Models = require('../model.js');
const dao = require('../dao.js');
let db = new dao();

beforeAll(() => Models.syncTestData());

describe('Correct Data', () =>
{
	it('correct data in users', done =>
	{
		db.getAllUsers().then(users =>
		{
			expect(users
				.map(user => user.toJSON())
				.map(user => (
					{
						userId: user.userId,
						username: user.username,
						password: user.password,
						// salt: user.salt,
						email: user.email,

					})))
				.toEqual([
					{
						userId: 1,
						username: 'TestBruker1',
						password: 'TestBruker1',
						email: '1@mail.com'
					},
					{
						userId: 2,
						username: 'TestBruker2',
						password: 'TestBruker2',
						email: '2@mail.com'
					},
					{
						userId: 3,
						username: 'TestBruker3',
						password: 'TestBruker3',
						email: '3@mail.com'
					},
					{
						userId: 4,
						username: 'TestBruker4',
						password: 'TestBruker4',
						email: '4@mail.com'
					},
					{
						userId: 5,
						username: 'TestBruker5',
						password: 'TestBruker5',
						email: '5@mail.com'
					},
					{
						userId: 6,
						username: 'TestBruker6',
						password: 'TestBruker6',
						email: '6@mail.com'
					}
				]);
			console.log(users);
			done();
		});
	});

	it('correct data in events', done =>
	{
		db.getAllEvents().then(events =>
		{
			expect(events
				.map(event => event.toJSON())
				.map(event => (
					{
						eventId: event.eventId,
						organizerId: event.organizerId,
						eventName: event.eventName,
						address: event.address,
						ageLimit: event.ageLimit,
						startTime: event.startTime,
						endTime: event.endTime,
						imageURL: event.imageURL,
						image: event.image,
						description: event.description
					})))
				.toEqual([
					{
						eventId: 1,
						organizerId: 1,
						eventName: 'Test1',
						address: 'Adresse1',
						ageLimit: 12,
						startTime: null,
						endTime: null,
						imageURL: null,
						image: null,
						description: 'Konsert for barn'
					},
					{
						eventId: 2,
						organizerId: 2,
						eventName: 'Test1',
						address: 'Adresse2',
						ageLimit: 20,
						startTime: null,
						endTime: null,
						imageURL: null,
						image: null,
						description: 'Konsert for voksne'
					}
				]);
			done();
		});
	});
});



describe('Login', () =>
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


describe('User', () =>
{
	it('find user by id and username', done =>
	{
		db.findUser(1,'TestBruker1').then(users =>
		{
			console.log(users);
			expect(users
				.map(user => user.toJSON())
				.map(user => (
					{
						userId: user.userId,
						username: user.username,
						password: user.password,
						// salt: user.salt,
						email: user.email,

					})))
				.toEqual([
					{
						userId: 1,
						username: 'TestBruker1',
						password: 'TestBruker1',
						email: '1@mail.com'
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
		let user = {userId: '4', username: 'TestBrukerUpdated', password: 'PassordUpdated', salt: ':)', email: '4@mail.com'};
		db.updateUser(user).then(response =>
		{
			expect(response).toBeTruthy();
			done();
		});
	});

	it('update user fail', done =>
	{
		let user = {userId: '-1', username: 'TestBrukerUpdated', password: 'PassordUpdated', salt: ':)', email: '4@mail.com'};
		db.updateUser(user).then(response =>
		{
			expect(response).toBeTruthy();
			done();
		});
	});
});

describe('Event', () =>
{
	it('create event', done =>
	{
		let event = {
			organizerId: '3',
			eventName: 'CreateEventTest',
			address: 'event.address,',
			ageLimit: '45',
			startTime: null,
			endTime: null,
			description: 'if you can see this the event was created properly'
		};
		db.createEvent(event).then(response =>
		{
			console.log(response);
			expect(response.insertId).toEqual(3);
			done();
		});
	});

	it('update event success', done =>
	{
		let event = {
			eventId: '2',
			organizerId: '2',
			eventName: 'UpdateEventTest',
			address: 'event.address',
			ageLimit: '20',
			startTime: null,
			endTime: null,
			description: 'EVENT UPDATED'
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
			eventName: 'UpdateEventTest',
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



describe('Uncategorized', () =>
{

});

