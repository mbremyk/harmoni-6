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
						// image: event.image,
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



describe('Event', () =>
{
	it('update  an event', done =>
	{
		let event = {eventId: 1, eventname: 'TestUpdate'};
		expect(db.updateEvent(event)).toBeTruthy();
		done();
	});

	it('post an event', () =>
	{
		let event = {};
		expect(db.createEvent(event)).toBeTruthy();
	});
});



describe('Uncategorized', () =>
{
	it('Find user by id and username', done =>
	{
		expect(db.findUser('1', 'TestBruker1')
		         .map(user => ({
			         userId: user.userId,
			         username: user.username,
			         email: user.email
		         })))
			.toEqual({userId: 1, username: 'TestBruker1', email: '1@mail.com'});
		done();
	});
});

