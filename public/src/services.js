//const axios = require('axios');
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

class Services {
    login(email, password) {
        return axios.post(url + '/login', {email: email, password: password}).then(response => response.data);
    }

    logout() {
        return axios.post(url + '/auth/logout', {}, {headers: {'x-access-token': authService.getToken()}})
    }

    createUser(user) {
        return axios.post(url + '/users', user).then(response => response.data);
    }

    getUsers() {
        return axios.get(url + '/users').then(response => response.data);
    }
    updateUser(user) {
        return axios.put(url + '/auth/user/:userId', user, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }
    getUser(id) {
        return axios.get(url + '/users/' + id).then(response => response.data);
    }

    getEvents() {
        return axios.get(url + '/events').then(response => response.data);
    }

    createEvent(event) {
        return axios.post(url + '/events', event).then(response => response.insertId);
    }

    uploadContract(formData, event, artist) {
        return axios.post(url + "/contract/" + event + "/" + artist, formData).then(response => console.log(response.data));
    }

    /*downloadContract(event, artist)
    {
        //This approach to downloading the files does not work
        //return axios.get(url+"/contract/"+event+"/"+artist).then(response => response);
    }*/

    getAccessToken(email, hashedPassword) {
        return axios.post(url + '/accesstoken/', {
            email: email,
            hashedPassword: hashedPassword
        }).then(response => response.data);
    }

    createGig(gig) {
        return axios.post(url + '/gigs', gig).then(response => response.data);
    }

    getTicketToEvent(eventId) {
        return axios.get(url + '/tickets/' + eventId).then(response => response.data);
    }

    searchForEvents(input) {
        return axios.get(url + '/events/search/:' + encodeURIComponent(input)).then(response => response.data);
    }

    getEventsByOrganizer(userId) {
        return axios.get(url + '/auth/events/users/' + userId, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    getEventByEventId(eventId) {
        return axios.get(url + '/events/eventDetails/' + eventId).then(response => response.data);
    }
}

export let service = new Services();