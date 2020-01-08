import {UserModel} from '../model.js';
import {syncTestData} from 'testData.js';

beforeAll(() => syncTestData);


describe('All users test', () =>
{
	it('correct data', done =>
	{
		UserModel.findAll().then(users =>
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
						id: '1',
						name: 'TestBruker1',
						password: 'TestBruker1',
						email: '1@mail.com'
					},
					{
						id: '2',
						name: 'TestBruker2',
						password: 'TestBruker2',
						email: '2@mail.com'
					},
					{
						id: '3',
						name: 'TestBruker3',
						password: 'TestBruker3',
						email: '3@mail.com'
					},
					{
						id: '4',
						name: 'TestBruker4',
						password: 'TestBruker4',
						email: '4@mail.com'
					},
					{
						id: '5',
						name: 'TestBruker5',
						password: 'TestBruker5',
						email: '5@mail.com'
					},
					{
						id: '6',
						name: 'TestBruker6',
						password: 'TestBruker6',
						email: '6@mail.com'
					}
				]);
			done();
		});
	});
});


