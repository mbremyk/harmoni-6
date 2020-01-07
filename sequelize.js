const Sequelize = require('sequelize');
const properties = require('./properties.js');

let pr = new Properties();

let sequelize = process.env.CI ? new Sequelize("School", "root", "", {
    host: "mysql",
    dialect: "mysql"
}) : new Sequelize(pr.databaseName, pr.databaseUser, pr.databasePassword, {
    host: pr.databaseURL,//process.env.CI ? 'mysql' : 'localhost', // The host is 'mysql' when running in gitlab CI
    dialect: pr.dialect
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

type User = {
    userId,
    username,
    password,
    salt,
    email
};

let UserModel: Class<Sequelize.Model<User>> = sequelize.define('user', {
    userId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: Sequelize.STRING, unique: true},
    password: Sequelize.STRING.BINARY,
    salt: Sequelize.STRING.BINARY,
    email: Sequelize.STRING
}, {
    timestamps: true
});

type Concert = {
    concertId,
    organizerId,    //userId
    concertName,
    address,
    ageLimit,
    dateTime,
    description,
    contract
}

let ConcertModel: Class<Sequelize.Model<Concert>> = sequelize.define('concert', {
    concertId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    organizerId: {
        type: Sequelize.INTEGER, references: {
            model: UserModel,
            key: 'userId'
        }
    },
    concertName: Sequelize.STRING,
    address: Sequelize.STRING,
    ageLimit: Sequelize.INTEGER,
    dateTime: Sequelize.DATE,
    description: Sequelize.TEXT,
    contract: Sequelize.STRING
});

type Gig = {
    artistId,
    concertId,
    rider
}

let GigModel: Class<Sequelize.Model<Gig>> = sequelize.define('gig', {
    artistId: {type: Sequelize.INTEGER, primaryKey: true},
    concertId: {type: Sequelize.INTEGER, primaryKey: true},
    rider: Sequelize.STRING
});

type Ticket = {
    concertId,
    type,
    price,
    amount
}

let TicketModel: Class<Sequelize.Model<Ticket>> = sequelize.define('ticket', {
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