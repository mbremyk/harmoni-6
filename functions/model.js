const Sequelize = require('sequelize');
const properties = require('./properties.js');
const isCI = require('is-ci');

function init()
{
    //let test = process.env.NODE_ENV === 'test';
	let test = true;
	if (isCI)
	{
		console.log("CI");
		let sequelize = new Sequelize('School', 'root', '', {
			host: process.env.CI ? 'mysql' : 'localhost',
			dialect: 'mysql',
			pool: {
				max: 10,
				min: 0,
				idle: 10000
			},
			logging: false
		});
		return sequelize;
	}
	else
	{
		let pr = test ? new properties.SebProperties() : new properties.Properties();
		console.log(pr.databaseUser);
		let sequelize = new Sequelize(pr.databaseName, pr.databaseUser, pr.databasePassword, {
			host: pr.databaseURL,
			dialect: pr.dialect,
			pool: {
				max: 10,
				min: 0,
				idle: 10000
			},
			logging: false
		});
		return sequelize;
	}
}

let sequelize = init();

sequelize
	.authenticate()
	.then(() =>
	{
		console.log('Connection has been established successfully.');
	})
	.catch(err =>
	{
		console.error('Unable to connect to the database:', err);
	});

/*class User {
    userId;
    username;
    password;
    salt;
    email;
};*/

let UserModel = sequelize.define('user', {
	userId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
	username: {type: Sequelize.STRING, unique: true, allowNull: false},
	password: Sequelize.STRING.BINARY,
	salt: Sequelize.STRING.BINARY,
	email: Sequelize.STRING
}, {
	timestamps: true
});

/*class Concert {
    concertId;
    organizerId;    //userId
    concertName;
    address;
    ageLimit;
    dateTime;
    description;
}*/

let ConcertModel = sequelize.define('concert', {
	concertId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
	organizerId: {
		type: Sequelize.INTEGER, references: {
			model: UserModel,
			key: 'userId'
		},
		allowNull: false
	},
	concertName: {type: Sequelize.STRING, allowNull: false},
	address: Sequelize.STRING,
	ageLimit: Sequelize.INTEGER,
	dateTime: Sequelize.DATE,
	description: Sequelize.TEXT,
});

/*class Gig {
    artistId;
    concertId;
    rider;
    contract;
}*/

let GigModel = sequelize.define('gig', {
	artistId: {type: Sequelize.INTEGER, primaryKey: true},
	concertId: {type: Sequelize.INTEGER, primaryKey: true},
	rider: Sequelize.BLOB,
	contract: Sequelize.BLOB
});

/*class Ticket {
    concertId;
    type;
    price;
    amount;
}*/

let TicketModel = sequelize.define('ticket', {
	concertId: {
		type: Sequelize.INTEGER, primaryKey: true, references: {
			model: ConcertModel,
			key: 'concertId'
		}
	},
	type: Sequelize.STRING,
	price: Sequelize.INTEGER,
	amount: Sequelize.INTEGER
});

/*class Personnel {
    personnelId;
    concertId;
}*/

let PersonnelModel = sequelize.define('personnel', {
	personnelId: {
		type: Sequelize.INTEGER, primaryKey: true, references: {
			model: UserModel,
			key: 'userId'
		}
	},
	concertId: {
		type: Sequelize.INTEGER, primaryKey: true, references: {
			model: ConcertModel,
			key: 'concertId'
		}
	}
}, {tableName: 'personnel'});

let syncModels = () => sequelize.sync({force: true}).then().catch(error => console.log(error));

/*
creates tables in the testdatabase and inserts the test data
*/
let syncTestData = () => sequelize.sync({force: false}).then(() =>
{
	return (
		UserModel.bulkCreate([
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
			ConcertModel.bulkCreate([
				{
					organizerId: '1',
					concertName: 'Test1',
					address: 'Adresse1',
					ageLimit: '12',
					dateTime: null,
					description: 'Konsert for barn',
					contract: 'BLOB1'
				},
				{
					organizerId: '2',
					concertName: 'Test1',
					address: 'Adresse2',
					ageLimit: '20',
					dateTime: null,
					description: 'Konsert for voksne',
					contract: 'BLOB2'
				}]).then(() =>
			{
				GigModel.bulkCreate([
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
					PersonnelModel.bulkCreate([
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
						TicketModel.bulkCreate([
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


module.exports = {UserModel, ConcertModel, GigModel, PersonnelModel, TicketModel, syncModels, syncTestData};