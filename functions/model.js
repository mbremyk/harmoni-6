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
    username: {type: Sequelize.STRING, unique: true},
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
    contract;
}*/

let ConcertModel = sequelize.define('concert', {
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
    contract: Sequelize.BLOB
});

/*class Gig {
    artistId;
    concertId;
    rider;
}*/

let GigModel = sequelize.define('gig', {
    artistId: {type: Sequelize.INTEGER, primaryKey: true},
    concertId: {type: Sequelize.INTEGER, primaryKey: true},
    rider: Sequelize.STRING
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

let syncModels = () => sequelize.sync({force: false}).then().catch(error => console.log(error));

module.exports = {UserModel, ConcertModel, GigModel, PersonnelModel, TicketModel, syncModels};