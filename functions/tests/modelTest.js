const Models = require('../model.js');

beforeAll(() => Models.syncTestData());

describe('Correct Data', () =>
{
	it('correct data users', done =>
	{
		Models.UserModel.findAll().then(users =>
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

	it('correct data events', done =>
	{
		Models.EventModel.findOne().then(events =>
		{
			expect(events
				.map(event => event.toJSON())
				.map(event => (
					{
						eventId: event.id,
						organizerId: event.organizerId,
						eventName: event.name,
						address: event.password,
						agelimit: event.ageLimit,
						dateTime: event.dateTime,
						description: event.description,
						contract: event.contract,
					})))
				.toEqual([
					{
						organizerId: 1,
						eventName: 'Test1',
						address: 'Adresse1',
						ageLimit: 12,
						dateTime: '',
						description: 'Konsert for barn',
						contract: 'BLOB'
					},
					{
						organizerId: 2,
						eventName: 'Test1',
						address: 'Adresse2',
						ageLimit: '20',
						dateTime: '',
						description: 'Konsert for voksne',
						contract: 'BLOB'
					}
				]);
			done();
		});
	});
});

describe('Other type of methods', () =>
{
	it('is event organizer', done =>
	{
		Models.UserModel.findAll().then(users =>
		{
			expect(users
				.map(user => user.toJSON())
				.map((user) => (
					{
						id: user.id,
						name: user.name,
						password: user.password,
						email: user.email,

					})))
				.toEqual([
					{
						id: 1,
						name: 'TestBruker1',
						password: 'TestBruker1',
						email: '1@mail.com'
					},
					{
						id: 2,
						name: 'TestBruker2',
						password: 'TestBruker2',
						email: '2@mail.com'
					},
					{
						id: 3,
						name: 'TestBruker3',
						password: 'TestBruker3',
						email: '3@mail.com'
					},
					{
						id: 4,
						name: 'TestBruker4',
						password: 'TestBruker4',
						email: '4@mail.com'
					},
					{
						id: 5,
						name: 'TestBruker5',
						password: 'TestBruker5',
						email: '5@mail.com'
					},
					{
						id: 6,
						name: 'TestBruker6',
						password: 'TestBruker6',
						email: '6@mail.com'
					}
				]);
			done();
		});
	});

	it('is not event organizer', done =>
	{
		Models.EventModel.findOne().then(events =>
		{
			expect(events
				.map(event => event.toJSON())
				.map((event) => (
					{
						eventId: event.id,
						organizerId: event.organizerId,
						eventName: event.name,
						address: event.password,
						agelimit: event.ageLimit,
						dateTime: event.dateTime,
						description: event.description,
						contract: event.contract,
					})))
				.toEqual([
					{
						organizerId: 1,
						eventName: 'Test1',
						address: 'Adresse1',
						ageLimit: 12,
						dateTime: '',
						description: 'Konsert for barn',
						contract: 'BLOB'
					},
					{
						organizerId: 2,
						eventName: 'Test1',
						address: 'Adresse2',
						ageLimit: 20,
						dateTime: '',
						description: 'Konsert for voksne',
						contract: 'BLOB'
					}
				]);
			done();
		});
	});
});

