import axios from 'axios'
import {authService} from './AuthService'

var url = '';
if (window.location.href.includes('localhost:5000')) {
    url = 'http://localhost:5001/harmoni-6/us-central1/webApi/api/v1';
} else if (window.location.href.includes('localhost:3000')) {
    url = 'http://localhost:8080';
} else {
    url = 'https://us-central1-harmoni-6.cloudfunctions.net/webApi/api/v1';
}

export class Artist {

    userId;
    username;
    email;
    contract;
    document;

    constructor(userId, username, email, contract, document) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.contract = contract;
        this.document = document
    }

}

export class User {
    userId;
    username;
    password;
    salt;
    email;

    constructor(userId, username, email) {
        this.userId = userId;
        this.username = username;
        this.email = email;
    }
}

export class BugMail {
    from;
    description;
    text;

    constructor(from, description, text){
        this.from = from;
        this.description = description;
        this.text = text;
    }
}
export class Mail extends BugMail{
    to;
    constructor(to, from, description, text){
        super(from, description, text);
        this.to = text;
    }
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

    constructor(eventId, organizerId, eventName, city, address, placeDescription, description, ageLimit, startTime, endTime, imageUrl, cancelled) {
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
        this.artistId = artistId;
    }
}

export class RiderItem {
    eventId;
    artistId;
    item;
    confirmed;

    constructor(eventId, artistId, item) {
        this.eventId = eventId;
        this.artistId = artistId;
        this.item = item;
    }
}

export class Ticket {
    eventId;
    type;
    price;
    amount;

    constructor(eventId, type, price, amount){
        this.eventId = eventId;
        this.type = type;
        this.price = price;
        this.amount = amount;
    }
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

    forgotPass(email) {
        return axios.post(url + '/mail/password', {email: email}, {headers: {"Content-Type": "application/json"}}).then(response => response.data);
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

    deleteEvent(eventId) {
        return axios.delete(url + '/auth/events/' + eventId, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
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

    getMyEventsByUserId(userId) {
        return axios.get(url + '/myevents/users/' + userId, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }


    /*
        PERSONNEL
    */

    /**
     * @param personnel: Personnel[]
     * @returns Promise<>: boolean
     */
    addPersonnel(personnel) {
        return axios.post(url + '/auth/events/' + personnel[0].eventId + '/personnel', personnel, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    /**
     * @param personnel: Personnel[]
     * @returns Promise<>: boolean
     */
    updatePersonnel(personnel) {
        return axios.put(url + '/auth/events/' + personnel[0].eventId + '/personnel', personnel, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    /**
     * @param eventId: number
     * @param personnelId: number
     * @returns Promise<>: boolean
     */
    deletePersonnel(eventId, personnelId) {
        return axios.delete(url + '/auth/events/' + eventId + '/personnel/' + personnelId, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    /**
     * @param eventId: number
     * @returns Promise<>: Personnel[]
     */
    getPersonnel(eventId) {
        return axios.get(url + '/auth/events/' + eventId + '/personnel', {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }


    /*
        TICKETS
    */
    /**
     * @param tickets: Ticket[]
     * @returns Promise<>: boolean
     */
    addTickets(tickets) {
        return axios.post(url + '/auth/events/' + tickets[0].eventId + '/tickets', tickets, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    /**
     * @param ticket: Ticket
     * @returns Promise<>: boolean
     */
    updateTicket(ticket) {
        return axios.put(url + '/auth/events/' + ticket.eventId + '/tickets', ticket, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    /**
     * @param ticket: Ticket
     * @returns Promise<>: boolean
     */
    deleteTicket(ticket) {
        return axios.delete(url + '/auth/events/' + ticket.eventId + '/tickets/' + ticket.type, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    /**
     * @param eventId: number
     * @returns Promise<>: Ticket[]
     */
    getTicketToEvent(eventId) {
        return axios.get(url + '/events/' + eventId + '/tickets').then(response => response.data);
    }


    /*
        GIGS
    */
    /**
     * @param gig: Gig with file
     * @returns Promise<>: boolean
     */
    addGig(gig) {
        return axios.post(url + '/auth/events/' + gig.eventId + '/gigs', gig, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    /**
     * @param eventId: number
     * @returns Promise<>: Gig[]
     */
    getGigs(eventId) {
        return axios.get(url + '/auth/events/' + eventId + '/gigs', {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    /**
     * @param eventId: number
     * @param artistId: number
     * @returns Promise<>: Contract
     */
    downloadContract(eventId, artistId) {
        return axios.get(url + "/auth/events/" + eventId + "/gigs/" + artistId, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
    }

    /**
     * @param riderItems: RiderItem[]
     * @returns Promise<>: boolean
     */
    addRiderItems(riderItems) {
        return axios.post(url + '/auth/events/' + riderItems[0].eventId + '/gigs/' + riderItems[0].artistId + '/rider', riderItems, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data)
    }

    /**
     * @param riderItems: RiderItem[]
     * @returns Promise<>: boolean
     */
    confirmRiderItems(riderItems) {
        return axios.put(url + '/auth/events/' + riderItems[0].eventId + '/gigs/' + riderItems[0].artistId + '/rider', riderItems, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data)
    }

    /**
     * @param eventId: number
     * @param artistId: number
     * @returns Promise<>: RiderItem[]
     */
    getRiderItems(eventId, artistId) {
        return axios.get(url + '/auth/events/' + eventId + '/gigs/' + artistId + '/rider', {headers: {'x-access-token': authService.getToken()}}).then(response => response.data)
    }
    /*
        EMAIL
     */
    sendBug(mail){
        return axios.post(url+"/mail/bug", mail).then(response => response.data);
    }

    sendMails(mail){
        return axios.post(url+"/mail/info", mail).then(response => response.data);
    }


}

export let service = new Services();