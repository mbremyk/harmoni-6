import axios from 'axios'

var url = '';
if (window.location.href.includes('localhost:5000')) {
    url = 'http://localhost:5001/harmoni-6/us-central1/webApi/api/v1';
}else if (window.location.href.includes('localhost:3000')) {
    url = 'http://localhost:8080';
} else {
    url = 'https://us-central1-harmoni-6.cloudfunctions.net/webApi/api/v1';
}

export class User {
    userId;
    username;
    password;
    salt;
    email;
}

export class Event {
    eventId;
    organizerId;
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

    constructor(eventId, organizerId, eventName, city, address, placeDescription, description, ageLimit, startTime, endTime, imageUrl, image, cancelled) {
        this.eventId = eventId;
        this.organizerId = organizerId;
        this.eventName = eventName;
        this.city = city;
        this.address = address;
        this.placeDescription = placeDescription;
        this.description = description;
        this.ageLimit = ageLimit;
        this.startTime = startTime;
        this.endTime = endTime;
        this.imageUrl = imageUrl;
        this.image = image;
        this.cancelled = cancelled;
    }
}

export class SimpleFile {
    name;
    data;

    constructor(data, name) {
        this.name = name;
        this.data = data;
    }

}

export class Gig {

    eventId;
    artistId;
    contract;

    constructor(eventId, artistId, contract) {
        this.eventId = eventId;
        this.contract = contract;
        this.artists = artistId;
    }
}

export class RiderItem {
    eventId;
    artistId;
    riderItem;
    confirmed;

    constructor(eventId, artistId, riderItem) {
        this.eventId = eventId;
        this.artistId = artistId;
        this.riderItem = riderItem;
    }
}

export class Ticket {
    eventId;
    type;
    price;
    amount;
}

export class Personnel {
    personnelId;
    eventId;
    role;

    constructor(userId, eventId, role) {
        this.personnelId = userId;
        this.eventId = eventId;
        this.role = role;
    }

}

class Services {

    /*
        VERIFICATION
     */
    login(email, password) {
        return axios.post(url + '/login', {email: email, password: password}).then(response => response.data);
    }

    logout() {
        return axios.post(url + '/auth/logout', {}, {headers: {'x-access-token': authService.getToken()}})
    }

    refreshToken() {
        return axios.post(url + '/auth/refresh', {}, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    getAccessToken(email, hashedPassword) {
        return axios.post(url + '/accesstoken/', {
            email: email,
            hashedPassword: hashedPassword
        }).then(response => response.data);
    }

    validateUsername(username) {
        return axios.get(url + '/validate/username/' + username).then(response => response.data);
    }

    validateEmail(email) {
        return axios.get(url + '/validate/email/' + email).then(response => response.data);
    }


    /*
        USERS
    */
    createUser(user) {
        return axios.post(url + '/users', user).then(response => response.data);
    }

    updateUser(user) {
        return axios.put(url + '/auth/users/' + user.userId, user, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    deleteUser(userId) {
        return axios.delete(url + '/auth/users/' + userId, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    getUsers() {
        return axios.get(url + '/users').then(response => response.data);
    }

    getUser(userId) {
        return axios.get(url + '/users/' + userId).then(response => response.data);
    }

    /*
        EVENTS
    */
    createEvent(event) {
        return axios.post(url + '/auth/events', event, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    updateEvent(event) {
        return axios.put(url + "/auth/events/" + event.eventId, event, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    deleteEvent(event) {
        //console.log(url + '/auth/events/' + event.eventId);
        return axios.delete(url + '/auth/events/' + event.eventId, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    getEvents() {
        return axios.get(url + '/events').then(response => response.data);
    }

    searchForEvents(input) {
        return axios.get(url + '/events/search/' + encodeURIComponent(input)).then(response => response.data);
    }

    getEventByEventId(eventId) {
        return axios.get(url + '/events/eventDetails/' + eventId).then(response => response.data);
    }

    getEventsByOrganizer(userId) {
        return axios.get(url + '/auth/events/users/' + userId, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }


    /*
        PERSONNEL
    */
    addPersonnel(personnel) {
        return axios.post(url + '/events/' + personnel[0].eventId + '/personnel', personnel).then(response => response.data);
    }

    updatePersonnel(personnel) {
        return axios.put(url + '/events/' + personnel.eventId + '/personnel', personnel).then(response => response.data);
    }

    deletePersonnel(personnel) {
        return axios.delete(url + '/events/' + personnel.eventId + '/personnel', personnel).then(response => response.data);
    }

    getPersonnel(eventId) {
        return axios.get(url + '/events/' + eventId + '/personnel').then(response => response.data);
    }


    /*
        TICKETS
    */
    addTickets(tickets) {
        return axios.post(url + '/events/' + tickets[0].eventId + '/ticket', tickets).then(response => response.data);
    }

    updateTicket(ticket) {
        return axios.put(url + '/events/' + ticket.eventId + '/ticket', ticket).then(response => response.data);
    }

    deleteTicket(ticket) {
        return axios.delete(url + '/events/' + ticket.eventId + '/ticket', ticket).then(response => response.data);
    }

    getTicketToEvent(eventId) {
        return axios.get(url + '/events/' + eventId + '/ticket').then(response => response.data);
    }


    /*
        GIGS
    */
    addGig(gig) {
        return axios.post(url + '/gigs', gig).then(response => response.data);
    }

    getGigForEvent(eventId) {
        return axios.get(url + '/events/' + eventId + '/gigs').then(response => response.data);
    }

    addRiderItems(riderItems) {
        return axios.get(url + '/events/' + riderItems[0].eventId + '/gigs/' + riderItems[0].artistId).then(response => response.data)
    }

    getRiderItems(eventId, artistId) {
        return axios.get(url + '/events/' + eventId + '/gigs/' + artistId).then(response => response.data)
    }
}

export let service = new Services();