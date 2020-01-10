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
					},
					{
						userId: 2,
						username: 'Marius T',
						password: 'MT',
						salt: 'salt',
						email: 'marius@mail.com'
					},
					{
						userId: 3,
						username: 'Sebastian I',
						password: 'TestBruker1',
						salt: 'salt',
						email: 'sebastian@mail.com'
					},
					{
						userId: 4,
						username: 'Jakob L.M',
						password: 'JM',
						salt: 'salt',
						email: 'jakob@mail.com'
					},
					{
						userId: 5,
						username: 'Magnus B',
						password: 'MB',
						salt: 'salt',
						email: 'magnus@mail.com'
					},
					{
						userId: 6,
						username: 'Jan L',
						password: 'JL',
						salt: 'salt',
						email: 'jan@mail.com'
					},
					{
						userId: 7,
						username: 'Sivert U',
						password: 'SU',
						salt: 'salt',
						email: 'sivert@mail.com'
					},
					{
						userId: 8,
						username: 'Michael S.L',
						password: 'M',
						salt: 'salt',
						email: 'michael@mail.com'
					},
					{
						userId: 9,
						username: 'Sabine S',
						password: 'SS',
						salt: 'salt',
						email: 'sabine@mail.com'
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
					})))
				.toEqual([
					{
						eventId: 1,
						organizerId: 9,
						eventName: 'Fredagsquiz',
						address: 'Ikke en faktisk addresse 1',
						ageLimit: 0,
					},
					{
						eventId: 2,
						organizerId: 4,
						eventName: 'Ungdomskonsert',
						address: 'Sukkerhuset',
						ageLimit: 15,
					},
					{
						eventId: 3,
						organizerId: 7,
						eventName: 'D.D.E',
						address: 'Festningen',
						ageLimit: 18,
					},
					{
						eventId: 4,
						organizerId: 2,
						eventName: 'Kygokonsert på torget',
						address: 'Trondheim torg',
						ageLimit: 0,
					},
					{
						eventId: 5,
						organizerId: 2,
						eventName: 'Mandagsfylla',
						address: 'Sukkerhuset',
						ageLimit: 21,
					}
				]);
			done();
		});
	});
});



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
	it('find user by id and username', done =>
	{
		db.findUser(1, 'Steffen T').then(users =>
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



describe('Search', () =>
{
	it('search several results', done =>
	{
		db.findEventsBySearch('konsert').then(events =>
		{
			console.log(events);
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
			console.log(events);
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
});

