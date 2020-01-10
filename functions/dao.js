const sequelize = require("sequelize");
const model = require('./model.js');
const op = sequelize.Op;

let date_format = '\'%d %M %H:%i\'';


class Dao
{
	constructor() {}



	//returns array of all users in the database
	getAllUsers()
	{
		return model.UserModel.findAll();
	}



	//returns array of all events in database
	getAllEvents()
	{
		return model.EventModel.findAll();
	}



	findUser(userId, username)
	{
		return model.UserModel.findAll({where: {[op.and]: [{userId: userId}, {username: username}]}})
		            .then(user =>
		            {
			            if (user.length === 1) return user;
			            return null;
		            });
	}



	//returns true if an event is updated, false if too many, or noone is
	updateEvent(event)
	{
		return model.EventModel.update(
			{
				organizerId: event.organizerId,
				eventName: event.eventName,
				address: event.address,
				ageLimit: event.ageLimit,
				startTime: event.startTime,
				endTime: event.endTime,
				description: event.description
			},
			{where: {eventId: event.eventId}}
		).then(updated => (updated[0] /* affected rows */ === 1));
	}



	createEvent(event)
	{
		return model.EventModel.create(
			{
				organizerId: event.organizerId,
				eventName: event.eventName,
				address: event.address,
				ageLimit: event.ageLimit,
				startTime: event.startTime,
				endTime: event.endTime,
				description: event.description
			}
		).then(updated => ({insertId: (updated.id)}));
	}



	//chekcs if username and password match, then reuturns true or false
	loginOk(username, password)
	{
		return model.UserModel.findAll({where: {[op.and]: [{username: username}, {password: password}]}})
		            .then(response =>
		            {
			            return response.length === 1;
		            });
	}
}



module.exports = Dao;


