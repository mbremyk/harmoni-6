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
	eventName;
	eventAddress;
	ageLimit;
	image;
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




class Services
{
	createUser(user)
	{
		return axios.post(url + '/user', user).then(response => response.data);

	}

	getUsers()
	{
		return axios.get(url + 'user').then(response => response.data);
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
		//return axios.get<Events[]>('/events').then(response => response.data);
	}

	getAccessToken(email, hashedPassword){
		return axios.post(url + '/accesstoken/',{email: email, hashedPassword: hashedPassword}).then(response => response.data);
	}

}

export let service = new Services();