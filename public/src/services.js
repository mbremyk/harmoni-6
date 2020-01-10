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
	adress;
	ageLimit;
	image;
	Startdate;
	Enddate;
	discription;
}

class Services
{
	login(email, password)
	{
		return axios.post(url + '/login', {params: {email: email, password: password}}).then(response => response.data);
	}

	createUser(user)
	{
		return axios.post(url + '/user', user).then(response => response.data);

	}

	getEvents()
	{
		//return axios.get<Events[]>('/events').then(response => response.data);
	}
}

export let service = new Services();