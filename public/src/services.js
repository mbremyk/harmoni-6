//const axios = require('axios');
import axios from 'axios'
import {authService} from './AuthService'

var url = '';
if(window.location.href.includes('localhost')){
	url = 'http://localhost:5001/harmoni-6/us-central1/webApi/api/v1';
}else{
	url = 'https://us-central1-harmoni-6.cloudfunctions.net/webApi/api/v1';
}

export class User
{
	userId;
	username;
	password;
	salt;
	email;
}

export class Event
{
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

export class Ticket
{
    eventId;
    type;
    price;
    amount;
}

export class Personnel
{
	personnelId;
	eventId;
	role;

	constructor(personnelId, eventId, role){
		this.personnelId = personnelId;
		this.eventId = eventId;
		this.role = role;
	}

}

class Services
{
	login(email, password)
	{
		return axios.post(url + '/login', {email: email, password: password}).then(response => response.data);
	}

	logout()
	{
		return axios.post(url + '/auth/logout', {}, {headers: {'x-access-token': authService.getToken()}})
	}

	createUser(user)
	{
		return axios.post(url + '/user', user).then(response => response.data);
	}

	getUsers()
	{
		return axios.get(url + '/users').then(response => response.data);
	}

	getUser(id)
	{
		return axios.get(url + '/users/' + id).then(response => response.data);
	}

	getEvents()
	{
		return axios.get(url + '/events').then(response => response.data);
	}

	createEvent(event)
	{
		return axios.post(url + '/auth/events', event).then(response => response.data);
	}

	createGig(gig)
	{
		return axios.post(url + '/gigs', gig).then(response => response.data);
	}

	createPersonnel(personnel, eventId)
	{
		return axios.post(url + '/event/' + eventId + '/personell', personnel).then(response => response.data);
	}

	getPersonnel(id)
	{
		return axios.get(url + '/personnel').then(response => response.data);
	}

	getTicketToEvent(eventId)
	{
		return axios.get(url + '/tickets/' + eventId).then(response => response.data);
	}

	searchForEvents(input)
	{
		return axios.get(url + '/events/search/:' + encodeURIComponent(input)).then(response => response.data);
	}

	getEventsByOrganizer(userId)
	{
		return axios.get(url + '/auth/events/user/' + userId).then(response => response.data);
	}

	getEventByEventId(eventId)
	{
		return axios.get(url + '/events/eventdetails/' + eventId).then(response => response.data);
	}
}

export let service = new Services();