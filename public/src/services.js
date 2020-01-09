import axios from 'axios';

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
		//eturn axios.post<User, void>('/createUser', user).then(response => response.data);
	}

	getEvents()
	{
		//return axios.get<Events[]>('/events').then(response => response.data);
	}
}

export let service = new Services();