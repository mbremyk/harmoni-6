/*
TODO: USERS
 */
let users = [
    {
        //userId: 1
        username: 'Steffen T',
        password: 'ST',
        salt: 'salt',
        email: 'steffen@mail.com'
    },
    {
        //userId: 2
        username: 'Marius T',
        password: 'MT',
        salt: 'salt',
        email: 'marius@mail.com'
    },
    {
        //userId: 3
        username: 'Sebastian I',
        password: 'SI',
        salt: 'salt',
        email: 'sebastian@mail.com'
    },
    {
        //userId: 4
        username: 'Jakob L.M',
        password: 'JM',
        salt: 'salt',
        email: 'jakob@mail.com'
    },
    {
        //userId: 5
        username: 'Magnus B',
        password: 'MB',
        salt: 'salt',
        email: 'magnus@mail.com'
    },
    {
        //userId: 6
        username: 'Jan L',
        password: 'JL',
        salt: 'salt',
        email: 'jan@mail.com'
    },
    {
        //userId: 7
        username: 'Sivert U',
        password: 'SU',
        salt: 'salt',
        email: 'sivert@mail.com'
    },
    {
        //userId: 8
        username: 'Michael S.L',
        password: 'M',
        salt: 'salt',
        email: 'michael@mail.com'
    },
    {
        //userId: 9
        username: 'Sabine S',
        password: 'SS',
        salt: 'salt',
        email: 'sabine@mail.com'
    }
];


/*
TODO: EVENTS
 */
let events = [
    {
        //eventId: 1
        organizerId: 9, //Sabine
        eventName: 'Fredagsquiz',
        address: 'Ikke en faktisk addresse 1',
        ageLimit: 0,
        startTime: null,
        endTime: null,
        imageUrl: 'https://images.readwrite.com/wp-content/uploads/2019/08/Why-You-Love-Online-Quizzes-825x500.jpg',
        image: null,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' +
            'labore et dolore magna aliqua. Ultricies integer quis auctor elit. In est ante in nibh mauris cursus ' +
            'mattis molestie a. Dictumst quisque sagittis purus sit amet. Turpis egestas maecenas pharetra convallis ' +
            'posuere. Urna neque viverra justo nec ultrices. Sed odio morbi quis commodo odio aenean sed. Donec ' +
            'pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Sem et tortor consequat id porta nibh ' +
            'venenatis. Tincidunt id aliquet risus feugiat in ante metus dictum at. Cursus turpis massa tincidunt ' +
            'dui ut ornare. Faucibus nisl tincidunt eget nullam non nisi. Ultricies integer quis auctor elit. Urna ' +
            'et pharetra pharetra massa massa ultricies mi.'
    },
    {
        //eventId: 2
        organizerId: 4, //Jakob
        eventName: 'Ungdomskonsert',
        address: 'Sukkerhuset',
        ageLimit: 15,
        startTime: null,
        endTime: null,
        imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
        image: null,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' +
            'labore et dolore magna aliqua. Ultricies integer quis auctor elit. In est ante in nibh mauris cursus ' +
            'mattis molestievulputate sapien nec sagittis aliquam malesuada bibendum. Sem et tortor consequat id ' +
            'porta nibh venenatis. Tincidunt id aliquet risus feugiat in ante metus dictum at. Cursus turpis massa ' +
            'tincidunt dui ut ornare. Faucibus nisl tincidunt eget nullam non nisi. Ultricies integer quis auctor ' +
            'elit. Urna et pharetra pharetra massa massa ultricies mi.'
    },
    {
        //eventId: 3
        organizerId: 7, //Sivert
        eventName: 'D.D.E',
        address: 'Festningen',
        ageLimit: 18,
        startTime: null,
        endTime: null,
        imageUrl: 'https://www.bakgaarden.no/wp-content/uploads/2019/08/DDE-1-crop%C2%A9LineBerre-1030x686.jpg',
        image: null,
        description: 'D.D.E konsert det blir gøy'
    },
    {
        //eventId: 4
        organizerId: 2, //Marius
        eventName: 'Kygokonsert på torget',
        address: 'Trondheim torg',
        ageLimit: 0,
        startTime: null,
        endTime: null,
        imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
        image: null,
        description: 'Aliquet enim tortor at auctor urna nunc id cursus. Integer eget aliquet nibh praesent tristique ' +
            'magna. Consectetur adipiscing elit ut aliquam purus sit. Congue nisi vitae suscipit tellus mauris a diam ' +
            'maecenas. Nulla malesuada pellentesque elit eget gravida cum sociis. Non quam lacus suspendisse faucibus ' +
            'interdum posuere lorem ipsum. Aliquam sem et tortor consequat id porta. Ac tortor dignissim convallis aenean ' +
            'et tortor. Convallis a cras semper auctor. Vel turpis nunc eget lorem dolor sed. Eget magna fermentum iaculis ' +
            'eu non diam phasellus. Sagittis vitae et leo duis ut diam. Volutpat est velit egestas dui id ornare arcu.\n' +
            '\n' +
            'Sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque. Sed viverra ipsum nunc aliquet. ' +
            'Eget aliquet nibh praesent tristique magna sit amet. Nunc lobortis mattis aliquam faucibus purus in. At ' +
            'imperdiet dui accumsan sit amet nulla facilisi. Iaculis at erat pellentesque adipiscing commodo elit at ' +
            'imperdiet dui. Et magnis dis parturient montes nascetur. Ac auctor augue mauris augue neque gravida in. Sagittis ' +
            'id consectetur purus ut. Pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus. Viverra ' +
            'aliquet eget sit amet.\n' +
            '\n' +
            'Vitae tempus quam pellentesque nec nam aliquam sem et tortor. Nam aliquam sem et tortor consequat id. Senectus ' +
            'et netus et malesuada. Aliquam vestibulum morbi blandit cursus. Feugiat vivamus at augue eget arcu dictum ' +
            'varius duis. Donec massa sapien faucibus et. Nulla pellentesque dignissim enim sit amet. Urna porttitor rhoncus ' +
            'dolor purus. Bibendum arcu vitae elementum curabitur vitae. Erat nam at lectus urna duis convallis convallis ' +
            'tellus. Diam maecenas sed enim ut sem viverra. Diam quis enim lobortis scelerisque fermentum dui. Fringilla est ' +
            'ullamcorper eget nulla. Nisi lacus sed viverra tellus in hac habitasse platea. Non sodales neque sodales ut ' +
            'etiam sit. Feugiat in fermentum posuere urna nec tincidunt.'
    },
    {
        //eventId: 5
        organizerId: 2, //Marius
        eventName: 'Mandagsfylla',
        address: 'Sukkerhuset',
        ageLimit: 21,
        startTime: null,
        endTime: null,
        imageUrl: 'https://vulkanoslo.no/wp-content/uploads/2019/04/barvulkan_3.jpg',
        image: null,
        description: 'non pulvinar neque laoreet suspendisse interdum. Ullamcorper velit sed ullamcorper morbi tincidunt. ' +
            'Pellentesque adipiscing commodo elit at imperdiet dui accumsan. Dolor sit amet consectetur adipiscing elit ' +
            'duis. Porttitor leo a diam sollicitudin. Tempus egestas sed sed risus. Magna sit amet purus gravida quis ' +
            'blandit turpis. Enim eu turpis egestas pretium aenean pharetra magna ac placerat. At lectus urna duis ' +
            'convallis convallis. Sit amet tellus cras adipiscing enim eu turpis egestas pretium. Tincidunt id aliquet ' +
            'risus feugiat in ante.\n' +
            '\n' +
            'Aliquet enim tortor at auctor urna nunc id cursus. Integer eget aliquet nibh praesent tristique magna. ' +
            'Consectetur adipiscing elit ut aliquam purus sit. Congue nisi vitae suscipit tellus mauris a diam maecenas. ' +
            'Nulla malesuada pellentesque elit eget gravida cum sociis. Non quam lacus'
    }
];


let files = [
    {
        name: 'Fil 1',
        contentType: 'text',
        data: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci commodi deleniti earum eligendi enim, laborum magni minus molestiae nisi nobis officiis omnis quis reiciendis sint ut vel voluptate voluptates voluptatum. Aliquamaperiam architectoaspernatur atbeatae consequaturdicta eaet impeditlabore,maiores modimolestiae natusnostrum officia,quidem quodsaepe suscipitvelit vero ? Doloremque eiusmaiores nostrumsuscipit voluptates ?Aliquam consectetur corporis deleniti distinctio eaque earum error et harum incidunt ipsa laudantium molestiae nam, officiis optio praesentium provident qui quo quos sequi, similique sit velit, veniam veritatis vero voluptatibus.Aliquid laborum odio totam? Ab accusantium ad atque beatae consequuntur ea facere itaque labore, officiis perferendis quibusdam rem sed sunt tempore ullam! Assumenda consectetur facere quod quos repellendus ut voluptas?Accusantium asperiores autem cumque doloremque error excepturi explicabo hic illo ipsam iusto magni, maiores maxime molestiae natus officia porro quasi quia quibusdam quod rerum similique sunt ut voluptate. Autem, sequi."
    },
    {
        name: 'Fil 2',
        contentType: 'text',
        data: "Lorem var en dårlig idé"
    }
];

/*
TODO: GIGS
 */
let gigs = [
    {
        artistId: 5, //Magnus
        eventId: 2, //Ungdomskonert
        rider: 1,
        contract: 2
    },
    {
        artistId: 6, //Jan
        eventId: 3, //D.D.E
        rider: null,
        contract: null
    },
    {
        artistId: 8, //Michael
        eventId: 4, //Kygokonsert
        rider: null,
        contract: null
    }
];


/*
TODO: PERSONNEL
 */
let personnel = [
    {
        personnelId: 3, //Sebastian
        eventId: 1, //Fredagsquiz
        role: 'Quizmaster'
    },
    {
        personnelId: 4, //Jakob
        eventId: 2, //Ungdomskonert
        role: 'Crowd control'
    },
    {
        personnelId: 6, //Jan
        eventId: 2, //Ungdomskonert
        role: 'Diskolys'
    },
    {
        personnelId: 2, //Marius
        eventId: 3, //D.D.E
        role: 'Hypeman'
    },
    {
        personnelId: 7, //Sivert
        eventId: 4, //Kygokonsert
        role: 'Lys'
    },
    {
        personnelId: 8, //Michael
        eventId: 4, //Kygokonsert
        role: 'Sikkerhet'
    },
    {
        personnelId: 3, //Sebastian
        eventId: 5, //Mandagsfylla
        role: 'Bartender'
    }
];


/*
TODO: TICKETS
 */
let tickets = [
    {
        eventId: 1, //Fredagsquiz
        type: 'Inngang',
        price: 50,
        amount: 40
    },
    {
        eventId: 2, //Ungdomskonert
        type: 'Barn under 15år',
        price: 99,
        amount: 50
    },
    {
        eventId: 2, //Ungdomskonsert
        type: 'Voksen',
        price: 199,
        amount: 30
    },
    {
        eventId: 3, //D.D.E
        type: 'Gratis',
        price: 0,
        amount: 1000
    },
    {
        eventId: 4, //Kygokonsert
        type: 'Golden Circle',
        price: 1999,
        amount: 29
    },
    {
        eventId: 4, //Kygokonsert
        type: 'Early Bird',
        price: 199,
        amount: 100
    },
    {
        eventId: 4, //Kygokonsert
        type: 'Vanlig',
        price: 399,
        amount: 300
    },
    {
        eventId: 5, //Mandagsfylla
        type: 'Pris per øl',
        price: 69,
        amount: null
    }
];

module.exports = {users, events, gigs, personnel, tickets, files};
