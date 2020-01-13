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
	createdAt;
	updatedAt;
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
		return axios.post(url + '/user', user).then(response => response.data);
	}

	getEvents()
	{
		return axios.get(url + '/events').then(response => response.data);
	}

	getTicketToEvent(eventId)
	{
		return axios.get(url + '/tickets/' + eventId).then(response => response.data);
	}

	searchForEvents(input)
	{
		return axios.get('/events/search/' + encodeURIComponent(input)).then(response => response.data);
	}

	getEventsByOrganizer(organizerId)
	{
		return axios.get('/auth/events/user/' + organizerId).then(response => response.data);
	}

	getEventByEventId(eventId)
	{
		return axios.get('/events/eventdetails/' + eventId).then(response => response.data);
	}


}

export let service = new Services();