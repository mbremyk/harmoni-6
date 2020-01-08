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
		return axios.post<User, void>('/createUser', user).then(response => response.data);
	}
}

export let service = new Services();