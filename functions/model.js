const Sequelize = require('sequelize');
const isCI = require('is-ci');
const properties = (isCI ? null : require('./properties.js'));
const test = (process.env.NODE_ENV === 'test');
const moment = require('moment');
moment.locale('nb');

function init() {
    if (isCI) {
        console.log("CI");
        return new Sequelize('School', 'root', '', {host: 'mysql', dialect: 'mysql'});
    } else {
        let pr = test ? new properties.TestProperties() : new properties.Properties();
        console.log('Connected to db: ' + pr.databaseUser);
        return new Sequelize(pr.databaseName, pr.databaseUser, pr.databasePassword,
            {
                host: pr.databaseURL,
                dialect: pr.dialect,
                dialectOptions: {dateStrings: true,},
                pool: {max: 10, min: 0, idle: 10000},
                logging: false
            });
    }
}

function initCloud() {
    let pr = new properties.CloudProperties();
    const sequelize = new Sequelize(pr.databaseName, pr.databaseUser, pr.databasePassword, {
        dialect: pr.dialect,
        host: pr.databaseURL,
        // port: pr.port,
        timestamps: false,
        dialectOptions: {
            socketPath: '/cloudsql/kkdatabase'
        },
    });
    return sequelize;
}

let sequelize = init();
//let sequelize = initCloud();


sequelize.authenticate()
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
}; */

let UserModel = sequelize.define('user', {
    userId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: Sequelize.STRING, allowNull: false},
    password: Sequelize.STRING.BINARY,
    tempPassword: Sequelize.STRING.BINARY,
    salt: Sequelize.STRING.BINARY,
    email: {type: Sequelize.STRING, unique: true, allowNull: false}
}, {
    timestamps: true,
    paranoid: true
});


/*class Event {
    eventId;
    organizerId;    //userId
    eventName;
    city;
    address;
    placeDescription;
    ageLimit;
    startTime;
    endTime;
    imageUrl;
    image;
    description;
    cancelled;
}*/

let EventModel = sequelize.define('event', {
    eventId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    organizerId: {
        type: Sequelize.INTEGER,
        references: {
            model: UserModel,
            key: 'userId'
        },
        allowNull: false
    },
    eventName: {type: Sequelize.STRING, allowNull: false},
    city: {type: Sequelize.STRING, allowNull: true},
    address: Sequelize.STRING,
    placeDescription: {type: Sequelize.TEXT, allowNull: true},
    ageLimit: Sequelize.INTEGER,
    startTime: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('startTime')).format('YYYY-MM-DD HH:mm');
        }
    },
    endTime: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('endTime')).format('YYYY-MM-DD HH:mm');
        }
    },
    imageUrl: {type: Sequelize.TEXT, defaultValue: "https://picsum.photos/500"},
    image: Sequelize.TEXT,
    description: Sequelize.TEXT,
    cancelled: {type: Sequelize.BOOLEAN, defaultValue: false}
}, {paranoid: true});


/*class File {
    fileId;
    name;
    contentType;
    data;
}
 */

let FileModel = sequelize.define('file', {
    fileId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    contentType: {
        type: Sequelize.STRING
    },
    data: {
        type: Sequelize.TEXT
    }

}, {paranoid: true});


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
    contract: {
        type: Sequelize.INTEGER,
        references: {
            model: FileModel,
            key: 'fileId'
        }
    }
}, {paranoid: true});


/*
class Rider{
    artistId;
    eventId;
    riderItem;
    confirmed: boolean
}
 */
let RiderModel = sequelize.define('riderItem', {
    artistId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: UserModel,
            key: 'userId'
        },
    },
    eventId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: EventModel,
            key: 'eventId'
        },
    },
    item: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    confirmed: {
        type: Sequelize.BOOLEAN,
        default: null
    }
}, {paranoid: true});


/*class Personnel {
    personnelId;
    eventId;
    role;
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
}, {
    tableName: 'personnel',
    paranoid: true
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
}, {paranoid: true});

let BugModel = sequelize.define('bug', {
    bugId: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    email: Sequelize.STRING,
    username: Sequelize.STRING,
    subject: Sequelize.STRING,
    bugText: {type: Sequelize.TEXT, allowNull: false}
});

UserModel.hasMany(EventModel, {foreignKey: 'organizerId'});
EventModel.belongsTo(UserModel, {foreignKey: 'organizerId'});

UserModel.hasMany(GigModel, {foreignKey: 'artistId'});
GigModel.belongsTo(UserModel, {foreignKey: 'artistId'});

UserModel.hasMany(PersonnelModel, {foreignKey: 'personnelId'});
PersonnelModel.belongsTo(UserModel, {foreignKey: 'personnelId'});


EventModel.hasMany(GigModel, {foreignKey: 'eventId'});
GigModel.belongsTo(EventModel, {foreignKey: 'eventId'});

EventModel.hasMany(PersonnelModel, {foreignKey: 'eventId'});
PersonnelModel.belongsTo(EventModel, {foreignKey: 'eventId'});

EventModel.hasMany(TicketModel, {foreignKey: 'eventId'});
TicketModel.belongsTo(EventModel, {foreignKey: 'eventId'});


FileModel.hasOne(GigModel, {foreignKey: 'contract'});
GigModel.belongsTo(FileModel, {foreignKey: 'contract'});

FileModel.hasOne(GigModel, {foreignKey: 'rider'});
GigModel.belongsTo(FileModel, {foreignKey: 'rider'});


let syncModels = () => sequelize.sync({force: false}).then().catch(error => console.log(error));


/*
creates tables in the testdatabase and inserts the test data
*/
const testData = require('./tests/TestData.js');
let syncTestData = () => sequelize.sync({force: true}).then(() => {
    return UserModel.bulkCreate(testData.users).then(() => {
        return EventModel.bulkCreate(testData.events).then(() => {
            return FileModel.bulkCreate(testData.files).then(() => {
                return GigModel.bulkCreate(testData.gigs).then(() => {
                    return RiderModel.bulkCreate(testData.riderItems).then(() => {
                        return PersonnelModel.bulkCreate(testData.personnel).then(() => {
                            return TicketModel.bulkCreate(testData.tickets).then(() => true)
                        })
                    });
                });
            });
        });
    }).catch(error => {
        console.error(error);
        return false;
    });
});

let dropTables = () => {
    return GigModel.drop().then(() => {
        return FileModel.drop().then(() => {
            return TicketModel.drop().then(() => {
                return PersonnelModel.drop().then(() => {
                    return EventModel.drop().then(() => {
                        return UserModel.drop().then(() => true);
                    });
                });
            });
        });
    })
        .catch(error => {
            console.error(error);
            return false;
        });
};

module.exports = {
    UserModel,
    EventModel,
    GigModel,
    PersonnelModel,
    RiderModel,
    TicketModel,
    FileModel,
    syncModels,
    syncTestData,
    dropTables,
    BugModel
};