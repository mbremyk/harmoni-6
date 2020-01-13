const Sequelize = require('sequelize');
const properties = require('./properties.js');
const isCI = require('is-ci');
const test = (process.env.NODE_ENV === 'test');

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
    role: Sequelize.STRING
}, {tableName: 'personnel'});


let syncModels = () => sequelize.sync({force: false}).then().catch(error => console.log(error));









/*
creates tables in the testdatabase and inserts the test data
*/
let syncTestData = () => sequelize.sync({force: true}).then(() => {
    return (
        UserModel.bulkCreate([
            {
                username: 'Steffen T',
                password: 'ST',
                salt: 'salt',
                email: 'steffen@mail.com'
            },
            {
                username: 'Marius T',
                password: 'MT',
                salt: 'salt',
                email: 'marius@mail.com'
            },
            {
                username: 'Sebastian I',
                password: 'SI',
                salt: 'salt',
                email: 'sebastian@mail.com'
            },
            {
                username: 'Jakob L.M',
                password: 'JM',
                salt: 'salt',
                email: 'jakob@mail.com'
            },
            {
                username: 'Magnus B',
                password: 'MB',
                salt: 'salt',
                email: 'magnus@mail.com'
            },
            {
                username: 'Jan L',
                password: 'JL',
                salt: 'salt',
                email: 'jan@mail.com'
            },
            {
                username: 'Sivert U',
                password: 'SU',
                salt: 'salt',
                email: 'sivert@mail.com'
            },
            {
                username: 'Michael S.L',
                password: 'M',
                salt: 'salt',
                email: 'michael@mail.com'
            },
            {
                username: 'Sabine S',
                password: 'SS',
                salt: 'salt',
                email: 'sabine@mail.com'
            }]).then(() => {
            EventModel.bulkCreate([
                {
                    organizerId: '9',
                    eventName: 'Fredagsquiz',
                    address: 'Ikke en faktisk addresse 1',
                    ageLimit: '0',
                    startTime: null,
                    endTime: null,
                    imageUrl: 'https://images.readwrite.com/wp-content/uploads/2019/08/Why-You-Love-Online-Quizzes-825x500.jpg',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultricies integer quis auctor elit. In est ante in nibh mauris cursus mattis molestie a. Dictumst quisque sagittis purus sit amet. Turpis egestas maecenas pharetra convallis posuere. Urna neque viverra justo nec ultrices. Sed odio morbi quis commodo odio aenean sed. Donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Sem et tortor consequat id porta nibh venenatis. Tincidunt id aliquet risus feugiat in ante metus dictum at. Cursus turpis massa tincidunt dui ut ornare. Faucibus nisl tincidunt eget nullam non nisi. Ultricies integer quis auctor elit. Urna et pharetra pharetra massa massa ultricies mi.'
                },
                {
                    organizerId: '4',
                    eventName: 'Ungdomskonsert',
                    address: 'Sukkerhuset',
                    ageLimit: '15',
                    startTime: null,
                    endTime: null,
                    imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultricies integer quis auctor elit. In est ante in nibh mauris cursus mattis molestievulputate sapien nec sagittis aliquam malesuada bibendum. Sem et tortor consequat id porta nibh venenatis. Tincidunt id aliquet risus feugiat in ante metus dictum at. Cursus turpis massa tincidunt dui ut ornare. Faucibus nisl tincidunt eget nullam non nisi. Ultricies integer quis auctor elit. Urna et pharetra pharetra massa massa ultricies mi.'
                },
                {
                    organizerId: '7',
                    eventName: 'D.D.E',
                    address: 'Festningen',
                    ageLimit: '18',
                    startTime: null,
                    endTime: null,
                    imageUrl: 'https://www.bakgaarden.no/wp-content/uploads/2019/08/DDE-1-crop%C2%A9LineBerre-1030x686.jpg',
                    description: 'D.D.E konsert det blir gøy'
                },
                {
                    organizerId: '2',
                    eventName: 'Kygokonsert på torget',
                    address: 'Trondheim torg',
                    ageLimit: '0',
                    startTime: null,
                    endTime: null,
                    imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
                    description: 'Aliquet enim tortor at auctor urna nunc id cursus. Integer eget aliquet nibh praesent tristique magna. Consectetur adipiscing elit ut aliquam purus sit. Congue nisi vitae suscipit tellus mauris a diam maecenas. Nulla malesuada pellentesque elit eget gravida cum sociis. Non quam lacus suspendisse faucibus interdum posuere lorem ipsum. Aliquam sem et tortor consequat id porta. Ac tortor dignissim convallis aenean et tortor. Convallis a cras semper auctor. Vel turpis nunc eget lorem dolor sed. Eget magna fermentum iaculis eu non diam phasellus. Sagittis vitae et leo duis ut diam. Volutpat est velit egestas dui id ornare arcu.\n' +
                        '\n' +
                        'Sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque. Sed viverra ipsum nunc aliquet. Eget aliquet nibh praesent tristique magna sit amet. Nunc lobortis mattis aliquam faucibus purus in. At imperdiet dui accumsan sit amet nulla facilisi. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Et magnis dis parturient montes nascetur. Ac auctor augue mauris augue neque gravida in. Sagittis id consectetur purus ut. Pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus. Viverra aliquet eget sit amet.\n' +
                        '\n' +
                        'Vitae tempus quam pellentesque nec nam aliquam sem et tortor. Nam aliquam sem et tortor consequat id. Senectus et netus et malesuada. Aliquam vestibulum morbi blandit cursus. Feugiat vivamus at augue eget arcu dictum varius duis. Donec massa sapien faucibus et. Nulla pellentesque dignissim enim sit amet. Urna porttitor rhoncus dolor purus. Bibendum arcu vitae elementum curabitur vitae. Erat nam at lectus urna duis convallis convallis tellus. Diam maecenas sed enim ut sem viverra. Diam quis enim lobortis scelerisque fermentum dui. Fringilla est ullamcorper eget nulla. Nisi lacus sed viverra tellus in hac habitasse platea. Non sodales neque sodales ut etiam sit. Feugiat in fermentum posuere urna nec tincidunt.'
                },
                {
                    organizerId: '2',
                    eventName: 'Mandagsfylla',
                    address: 'Sukkerhuset',
                    ageLimit: '21',
                    startTime: null,
                    endTime: null,
                    imageUrl: 'https://vulkanoslo.no/wp-content/uploads/2019/04/barvulkan_3.jpg',
                    description: 'non pulvinar neque laoreet suspendisse interdum. Ullamcorper velit sed ullamcorper morbi tincidunt. Pellentesque adipiscing commodo elit at imperdiet dui accumsan. Dolor sit amet consectetur adipiscing elit duis. Porttitor leo a diam sollicitudin. Tempus egestas sed sed risus. Magna sit amet purus gravida quis blandit turpis. Enim eu turpis egestas pretium aenean pharetra magna ac placerat. At lectus urna duis convallis convallis. Sit amet tellus cras adipiscing enim eu turpis egestas pretium. Tincidunt id aliquet risus feugiat in ante.\n' +
                        '\n' +
                        'Aliquet enim tortor at auctor urna nunc id cursus. Integer eget aliquet nibh praesent tristique magna. Consectetur adipiscing elit ut aliquam purus sit. Congue nisi vitae suscipit tellus mauris a diam maecenas. Nulla malesuada pellentesque elit eget gravida cum sociis. Non quam lacus'
                }]).then(() => {
                GigModel.bulkCreate([
                    {
                        artistId: '5',
                        eventId: '2',
                        rider: null,
                        contract: null
                    },
                    {
                        artistId: '6',
                        eventId: '3',
                        rider: null,
                        contract: null
                    },
                    {
                        artistId: '8',
                        eventId: '4',
                        rider: null,
                        contract: null
                    }]).then(() => {
                    PersonnelModel.bulkCreate([
                        {
                            personnelId: '3',
                            eventId: '1',
                            role: 'Quizmaster'
                        },
                        {
                            personnelId: '4',
                            eventId: '2',
                            role: 'Crowd control'
                        },
                        {
                            personnelId: '5',
                            eventId: '2',
                            role: 'Diskolys'
                        },
                        {
                            personnelId: '2',
                            eventId: '3',
                            role: 'Hypeman'
                        },
                        {
                            personnelId: '7',
                            eventId: '4',
                            role: 'Lys'
                        },
                        {
                            personnelId: '8',
                            eventId: '4',
                            role: 'Sikkerhet'
                        },
                        {
                            personnelId: '3',
                            eventId: '5',
                            role: 'Bartender'
                        }]).then(() => {
                        TicketModel.bulkCreate([
                            {
                                eventId: '1',
                                type: 'Inngang',
                                price: '50',
                                amount: '40'
                            },
                            {
                                eventId: '2',
                                type: 'Barn under 15år',
                                price: '99',
                                amount: '50'
                            },
                            {
                                eventId: '2',
                                type: 'Voksen',
                                price: '199',
                                amount: '30'
                            },
                            {
                                eventId: '3',
                                type: 'Gratis',
                                price: '0',
                                amount: '1000'
                            },
                            {
                                eventId: '4',
                                type: 'Golden Circle',
                                price: '1999',
                                amount: '29'
                            },
                            {
                                eventId: '4',
                                type: 'Early Bird',
                                price: '199',
                                amount: '100'
                            },
                            {
                                eventId: '4',
                                type: 'Vanlig',
                                price: '399',
                                amount: '300'
                            },
                            {
                                eventId: '5',
                                type: 'Pris per øl',
                                price: '69',
                                amount: null
                            }
                        ]);
                    });
                });
            });
        })
    ).catch(error => console.log(error));
});

module.exports = {UserModel, EventModel, GigModel, PersonnelModel, TicketModel, syncModels, syncTestData};