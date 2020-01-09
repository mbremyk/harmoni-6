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

	uploadFile(formData)
	{
		return axios.post("/file", formData).then(response => response.data);
	}
}


export let service = new Services();