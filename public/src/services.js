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
	createUser(user)
	{
		return axios.post(url + '/user', user).then(response => response.data);

	}

	getEvents()
	{
		//return axios.get<Events[]>('/events').then(response => response.data);
	}

	uploadContract(formData, event, artist)
	{
		return axios.post(url+"/contract/"+event+"/"+artist, formData).then(response => console.log(response.data));
	}

	downloadContract(event, artist)
	{
		//This approach to downloading the files does not work
		//return axios.get(url+"/contract/"+event+"/"+artist)/*.then(response => response)*/;
	}

	getAccessToken(email, hashedPassword){
		return axios.post(url + '/accesstoken/',{email: email, hashedPassword: hashedPassword}).then(response => response.data);
	}

}

export let service = new Services();