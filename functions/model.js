const Sequelize = require('sequelize');
const properties = require('./properties.js');
const isCI = require('is-ci');

let pr = new properties.Properties();

/*let sequelize = process.env.CI ? new Sequelize("School", "root", "", {
    host: "mysql",
    dialect: "mysql"
}) : new Sequelize(pr.databaseName, pr.databaseUser, pr.databasePassword, {
    host: pr.databaseURL,//process.env.CI ? 'mysql' : 'localhost', // The host is 'mysql' when running in gitlab CI
    dialect: pr.dialect
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
            logging: false
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
            logging: false
        });
        return sequelize;
    }
}

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
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
    eventName: {type:Sequelize.STRING, allowNull:false},
    address: Sequelize.STRING,
    ageLimit: Sequelize.INTEGER,
    dateTime: Sequelize.DATE,
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

module.exports = {UserModel, EventModel, GigModel, PersonnelModel, TicketModel, syncModels};