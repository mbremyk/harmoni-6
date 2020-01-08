import {ConcertModel, GigModel, PersonnelModel, TicketModel, UserModel} from '../model.js';

const Sequelize = require('sequelize');
const properties = require('../properties.js');

let pr = new properties.TestProperties();

let sequelize = process.env.CI ? new Sequelize("School", "root", "", {
	host: "mysql",
	dialect: "mysql"
}) : new Sequelize(pr.databaseName, pr.databaseUser, pr.databasePassword, {
	host: pr.databaseURL,//process.env.CI ? 'mysql' : 'localhost', // The host is 'mysql' when running in gitlab CI
	dialect: pr.dialect
});

export let syncTestData = sequelize.sync({force: true}).then(() =>
{
	return (
		UserModel.bulkCreate([
			{
				name: 'TestBruker1',
				password: 'TestBruker1',
				salt: '1',
				email: '1@mail.com'
			},
			{
				name: 'TestBruker2',
				password: 'TestBruker2',
				salt: '2',
				email: '2@mail.com'
			},
			{
				name: 'TestBruker3',
				password: 'TestBruker3',
				salt: '3',
				email: '3@mail.com'
			},
			{
				name: 'TestBruker4',
				password: 'TestBruker4',
				salt: '4',
				email: '4@mail.com'
			},
			{
				name: 'TestBruker5',
				password: 'TestBruker5',
				salt: '5',
				email: '5@mail.com'
			},
			{
				name: 'TestBruker6',
				password: 'TestBruker6',
				salt: '6',
				email: '6@mail.com'
			}]).then(() =>
		{
			ConcertModel.bulkCreate([
				{
					address: 'Adresse1',
					organizerID: '1',
					ageLimit: '12',
					dateTime: '',
					description: 'Konsert for barn',
					contract: 'BLOB'
				},
				{
					address: 'Adresse2',
					organizerID: '2',
					ageLimit: '20',
					dateTime: '',
					description: 'Konsert for voksne',
					contract: 'BLOB'
				}]).then(() =>
			{
				GigModel.bulkCreate([
					{
						concertID: '1',
						userID: '1',
						rider: 'BLOB'
					},
					{
						concertID: '2',
						userID: '2',
						rider: 'BLOB'
					}]).then(() =>
				{
					PersonnelModel.bulkCreate([
						{
							concertID: '1',
							userID: '3',
							rolle: 'Lyd'
						},
						{
							concertID: '1',
							userID: '4',
							rolle: 'Lys'
						},
						{
							concertID: '1',
							userID: '5',
							rolle: 'Sikkerhet'
						},
						{
							concertID: '2',
							userID: '6',
							rolle: 'Lyd'
						}]).then(() =>
					{
						TicketModel.bulkCreate([
							{
								concertID: '1',
								type: '1',
								price: '99',
								amount: '1'
							},
							{
								concertID: '1',
								type: '2',
								price: '149',
								amount: '2'
							},
							{
								concertID: '1',
								type: '3',
								price: '199',
								amount: '100'
							},
							{
								conecertID: '2',
								type: '2',
								price: '299',
								amount: '200'
							}
						]);
					});
				});
			});
		})
	);
});