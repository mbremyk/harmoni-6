//const axios = require('axios');
import axios from 'axios'

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

	createEvent(event)
	{
		return axios.post(url + '/event', event).then(response => response.insertId);
	}

	createGig(gig){
		return axios.post(url + '/gig', gig).then(response => response.data);
	}

	getEvents()
	{
		return axios.get(url + '/events').then(response => response.data);
	}

	getTicketToEvent(eventId)
	{
		return axios.get(url + '/tickets/' + eventId).then(response => response.data);
	}

	getAccessToken(email, hashedPassword)
	{

    }
	getEvent(id)
	{
		return axios.get<Event>('/events/' + id).then(response => response.data);
	}


	getAccessToken(email, hashedPassword){
		return axios.post(url + '/accesstoken/',{email: email, hashedPassword: hashedPassword}).then(response => response.data);
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