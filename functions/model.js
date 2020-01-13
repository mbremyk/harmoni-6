const Sequelize = require('sequelize');
const properties = require('./properties.js');
const isCI = require('is-ci');
const test = (process.env.NODE_ENV === 'test');
const moment = require('moment');
moment.locale('nb');

function init() {
    if (isCI) {
        console.log("CI");
        let sequelize = new Sequelize('School', 'root', '', {
            host: 'mysql',
            dialect: 'mysql'
        });
        return sequelize;
    } else {
        let pr = test ? new properties.TestProperties() : new properties.Properties();
        let sequelize = new Sequelize(pr.databaseName, pr.databaseUser, pr.databasePassword, {
            host: pr.databaseURL,
            dialect: pr.dialect,
            dialectOptions: {
                dateStrings: true,
            },
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

let FileModel = sequelize.define('file', {
    fileId: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    path: Sequelize.STRING
});

let FileAccessModel = sequelize.define('fileAccess', {
    fileId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: FileModel,
            key: 'fileId'
        }
    },
    userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: UserModel,
            key: 'userId'
        }
    }
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
    startTime: {
        type:Sequelize.DATE,
        get(){
            return moment(this.getDataValue('startTime')).format('DD/MM/YYYY HH:mm');
        }
    },
    endTime: {type:Sequelize.DATE,
        get(){
            return moment(this.getDataValue('endTime')).format('DD/MM/YYYY HH:mm');
        }},
    imageUrl: Sequelize.STRING,
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
    artistId: {
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
    },
    rider: {
        type: Sequelize.INTEGER,
        references: {
            model: FileModel,
            key: 'fileId'
        }
    },
    contract: {
        type: Sequelize.INTEGER,
        references: {
            model: FileModel,
            key: 'fileId'
        }
    }
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
    type: {type: Sequelize.STRING, primaryKey: true},
    price: Sequelize.INTEGER,
    amount: Sequelize.INTEGER
});

/*class Personnel {
    personnelId;
    eventId;
}*/

let PersonnelModel = sequelize.define('personnel', {
    personnelId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: UserModel,
            key: 'userId'
        }
    },
    eventId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: EventModel,
            key: 'eventId'
        }
    },
    role: Sequelize.STRING
}, {tableName: 'personnel'});

let syncModels = () => sequelize.sync({force: false}).then().catch(error => console.log(error));


/*
creates tables in the testdatabase and inserts the test data
*/
const testData = require('./tests/TestData.js');
let syncTestData = () => sequelize.sync({force: true}).then(() => {
    return (
        UserModel.bulkCreate(testData.users).then(() => {
            EventModel.bulkCreate(testData.events).then(() => {
                PersonnelModel.bulkCreate(testData.personnel).then(() => {
                    TicketModel.bulkCreate(testData.tickets).then(() => {
                        GigModel.bulkCreate(testData.gigs);
                    });
                });
            });
        })
    ).catch(error => console.log(error));
});

module.exports = {UserModel, EventModel, GigModel, PersonnelModel, TicketModel, syncModels, syncTestData};