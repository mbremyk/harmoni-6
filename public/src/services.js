//const axios = require('axios');
import { axios } from 'axios'

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

class Services
{
	createUser(user)
	{
		return axios.post(url + '/user', user).then(response => response.data);
	}

	getAccessToken(email, hashedPassword){
		return axios.post('/accesstoken/',{email: email, hashedPassword: hashedPassword}).then(response => response.data);
	}

}

export let service = new Services();