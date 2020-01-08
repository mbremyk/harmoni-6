import axios from 'axios';

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
		return axios.post('/createUser', user).then(response => response.data);
	}

	getAccessToken(email, hashedPassword){
		return axios.post('/accesstoken/',{email: email, hashedPassword: hashedPassword}).then(response => response.data);
	}

}

export let service = new Services();