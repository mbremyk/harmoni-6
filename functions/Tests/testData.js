const model = require('../model');


const Sequelize = require('sequelize');
const properties = require('../properties.js');
const isCI = require('is-ci');

let pr = new properties.SebProperties();

/*let sequelize = process.env.CI ? new Sequelize("School", "root", "", {
	host: "mysql",
	dialect: "mysql"
}) : new Sequelize(pr_test.databaseName, pr_test.databaseUser, pr_test.databasePassword, {
	host: pr_test.databaseURL,//process.env.CI ? 'mysql' : 'localhost', // The host is 'mysql' when running in gitlab CI
	dialect: pr_test.dialect
});*/

let sequelize = init();

function init() {
	if (!isCI){
		let sequelize = new Sequelize(pr.databaseName, pr.databaseUser, pr.databasePassword, {
			host: pr.databaseURL,
			dialect: pr.dialect,
			pool: {
				max: 10,
				min: 0,
				idle: 10000
			},
		});
		return sequelize;
	}else{
		console.log("CI");
		let sequelize = new Sequelize('School', 'root', '', {
			host: process.env.CI ? 'mysql' : 'localhost',
			dialect: 'mysql',
			pool: {
				max: 10,
				min: 0,
				idle: 10000
			},

		});
		return sequelize;
	}
}

let syncTestData = () => sequelize.sync({force: true}).then(() =>
{
	return (
		model.UserModel.bulkCreate([
			{
				username: 'TestBruker1',
				password: 'TestBruker1',
				salt: '1',
				email: '1@mail.com'
			},
			{
				username: 'TestBruker2',
				password: 'TestBruker2',
				salt: '2',
				email: '2@mail.com'
			},
			{
				username: 'TestBruker3',
				password: 'TestBruker3',
				salt: '3',
				email: '3@mail.com'
			},
			{
				username: 'TestBruker4',
				password: 'TestBruker4',
				salt: '4',
				email: '4@mail.com'
			},
			{
				username: 'TestBruker5',
				password: 'TestBruker5',
				salt: '5',
				email: '5@mail.com'
			},
			{
				username: 'TestBruker6',
				password: 'TestBruker6',
				salt: '6',
				email: '6@mail.com'
			}]).then(() =>
		{
			model.ConcertModel.bulkCreate([
				{
					organizerId: '1',
					concertName: 'Test1',
					address: 'Adresse1',
					ageLimit: '12',
					dateTime: 'Soon',
					description: 'Konsert for barn',
					contract: 'BLOB1'
				},
				{
					organizerId: '2',
					concertName: 'Test1',
					address: 'Adresse2',
					ageLimit: '20',
					dateTime: 'Kinda soon',
					description: 'Konsert for voksne',
					contract: 'BLOB2'
				}]).then(() =>
			{
				model.GigModel.bulkCreate([
					{
						artistId: '1',
						concertId: '1',
						rider: 'BLOB3'
					},
					{
						artistId: '2',
						concertId: '2',
						rider: 'BLOB4'
					}]).then(() =>
				{
					model.PersonnelModel.bulkCreate([
						{
							personnelId: '3',
							concertId: '1',
							role: 'Lyd'
						},
						{
							personnelId: '4',
							concertId: '1',
							role: 'Lys'
						},
						{
							personnelId: '5',
							concertId: '1',
							role: 'Sikkerhet'
						},
						{
							personnelId: '6',
							concertId: '2',
							role: 'Lyd'
						}]).then(() =>
					{
						model.TicketModel.bulkCreate([
							{
								concertId: '1',
								type: '1',
								price: '99',
								amount: '1'
							},
							{
								concertId: '1',
								type: '2',
								price: '149',
								amount: '2'
							},
							{
								concertId: '1',
								type: '3',
								price: '199',
								amount: '100'
							},
							{
								conecertId: '2',
								type: '2',
								price: '299',
								amount: '200'
							}
						]);
					});
				});
			});
		})
	).catch(error => console.log(error));
});

module.exports = {syncTestData};