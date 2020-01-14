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
		return axios.post(url + '/users', user).then(response => response.data);
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
		return axios.post(url + '/events', event).then(response => response.insertId);
	}

	createGig(gig)
	{
		return axios.post(url + '/gigs', gig).then(response => response.data);
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
		return axios.get(url + '/auth/events/user/' + userId, {headers: {'x-access-token': authService.getToken()}}).then(response => response.data);
	}

	getEventByEventId(eventId)
	{
		return axios.get(url + '/events/eventDetails/' + eventId).then(response => response.data);
	}

	getPersonellForEvent(eventId)
	{
		return axios.get(url + '/event/' + eventId + '/personnel').then(response => response.data);
	}

	getGigForEvent(eventId)
	{
		//return axios.get(url + '')
	}
}

export let service = new Services();