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
	eventAddress;
	ageLimit;
	image;
	imageUrl
	startDate;
	endDate;
	description;

}

export class Gig
{
	artistId;
	eventId;
	rider;
	contract;
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
	createUser(user)
	{
		return axios.post(url + '/user', user).then(response => response.data);

	}

	getUsers()
	{
		return axios.get(url + '/user').then(response => response.data);
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

	getEvent()
	{
		return axios.get<Event>('/events/:id').then(response => response.data);
	}


	getAccessToken(email, hashedPassword)
	{
		return axios.post(url + '/accesstoken/',{email: email, hashedPassword: hashedPassword}).then(response => response.data);
	}

	searchForEvents(input)
	{
		return axios.get('/events/search/:' + encodeURIComponent(input)).then(response => response.data);
	}


}

export let service = new Services();