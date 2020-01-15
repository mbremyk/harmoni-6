import axios from 'axios'
import {authService} from './AuthService'

var url = '';
if (window.location.href.includes('localhost')) {
    url = 'http://localhost:5001/harmoni-6/us-central1/webApi/api/v1';
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
    address;
    ageLimit;
    startTime;
    endTime;
    imageUrl;
    image;
    description;

    constructor(eventId, organizerId, eventName, address, description, ageLimit, startTime, endTime, imageURL, image) {
        this.eventId = eventId;
        this.organizerId = organizerId;
        this.eventName = eventName;
        this.address = address;
        this.description = description;
        this.ageLimit = ageLimit;
        this.startTime = startTime;
        this.endTime = endTime;
        this.imageUrl = imageURL;
        this.image = image;
    }
}

export class Gig {

    artistId;
    eventId;
    rider;
    contract;

    constructor(artistId, eventId, rider, contract) {
        this.artistId = artistId;
        this.eventId = eventId;
        this.rider = rider;
        this.contract = contract;
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

    constructor(personnelId, eventId, role) {
        this.personnelId = personnelId;
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
        return axios.put(url + '/auth/users/:userId', user, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
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
    createPersonnel(personnel) {
        return axios.post(url + '/events/' + personnel.eventId + '/personnel', personnel).then(response => response.data);
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
    createTicket(ticket) {
        return axios.post(url + '/events/' + ticket.eventId + '/ticket', ticket).then(response => response.data);
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
    createGig(gig) {
        return axios.post(url + '/events/' + gig.eventId + '/gigs', gig).then(response => response.data);
    }

    uploadContract(formData, event, artist) {
        return axios.post(url + "/contract/" + event + "/" + artist, formData).then(response => console.log(response.data));
    }

    /*downloadContract(event, artist)
    {
        //This approach to downloading the files does not work
        //return axios.get(url+"/contract/"+event+"/"+artist).then(response => response);
    }*/


}

export let service = new Services();