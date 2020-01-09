const Sequelize = require('sequelize');
const properties = require('./properties.js');
const isCI = require('is-ci');
const test = (process.env.NODE_ENV === 'test');

function init()
{
	if (isCI)
	{
		console.log("CI");
		let sequelize = new Sequelize('School', 'root', '', {
			host: 'mysql',
			dialect: 'mysql'
		});
		return sequelize;
	}
	else
	{
		let pr = test ? new properties.TestProperties() : new properties.Properties();
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

/*class Event {
    eventId;
    organizerId;    //userId
    eventName;
    address;
    ageLimit;
    dateTime;
    description;
}*/

let EventModel = sequelize.define('event', {
	eventId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
	organizerId: {
		type: Sequelize.INTEGER, references: {
			model: UserModel,
			key: 'userId'
		},
		allowNull: false
	},
	eventName: {type: Sequelize.STRING, allowNull: false},
	address: Sequelize.STRING,
	ageLimit: Sequelize.INTEGER,
	startTime: Sequelize.DATE,
	endTime: Sequelize.DATE,
	image: Sequelize.BLOB,
	description: Sequelize.TEXT,
});

/*class Gig {
    artistId;
    eventId;
    rider;
    contract;
}*/

let GigModel = sequelize.define('gig', {
	artistId: {type: Sequelize.INTEGER, primaryKey: true},
	eventId: {type: Sequelize.INTEGER, primaryKey: true},
	rider: Sequelize.BLOB,
	contract: Sequelize.BLOB
});

/*class Ticket {
    eventId;
    type;
    price;
    amount;
}*/

let TicketModel = sequelize.define('ticket', {
	eventId: {
		type: Sequelize.INTEGER, primaryKey: true, references: {
			model: EventModel,
			key: 'eventId'
		}
	},
	type: Sequelize.STRING,
	price: Sequelize.INTEGER,
	amount: Sequelize.INTEGER
});

/*class Personnel {
    personnelId;
    eventId;
}*/

let PersonnelModel = sequelize.define('personnel', {
	personnelId: {
		type: Sequelize.INTEGER, primaryKey: true, references: {
			model: UserModel,
			key: 'userId'
		}
	},
	eventId: {
		type: Sequelize.INTEGER, primaryKey: true, references: {
			model: EventModel,
			key: 'eventId'
		}
	}
}, {tableName: 'personnel'});


let syncModels = () => sequelize.sync({force: false}).then().catch(error => console.log(error));

/*
creates tables in the testdatabase and inserts the test data
*/
let syncTestData = () => sequelize.sync({force: true}).then(() =>
{
	return UserModel.bulkCreate([
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
			EventModel.bulkCreate([
				{
					organizerId: '1',
					eventName: 'Test1',
					address: 'Adresse1',
					ageLimit: '12',
					dateTime: null,
					description: 'Konsert for barn',
					contract: 'BLOB1'
				},
				{
					organizerId: '2',
					eventName: 'Test1',
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
						eventId: '1',
						rider: 'BLOB3'
					},
					{
						artistId: '2',
						eventId: '2',
						rider: 'BLOB4'
					}]).then(() =>
				{
					PersonnelModel.bulkCreate([
						{
							personnelId: '3',
							eventId: '1',
							role: 'Lyd'
						},
						{
							personnelId: '4',
							eventId: '1',
							role: 'Lys'
						},
						{
							personnelId: '5',
							eventId: '1',
							role: 'Sikkerhet'
						},
						{
							personnelId: '6',
							eventId: '2',
							role: 'Lyd'
						}]).then(() =>
					{
						TicketModel.bulkCreate([
							{
								eventId: '1',
								type: '1',
								price: '99',
								amount: '1'
							},
							{
								eventId: '1',
								type: '2',
								price: '149',
								amount: '2'
							},
							{
								eventId: '1',
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
		}
	).catch(error => console.log(error));
});


module.exports = {UserModel, EventModel, GigModel, PersonnelModel, TicketModel, syncModels, syncTestData};