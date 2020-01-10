const sequelize = require("sequelize");
const model = require('./model.js');
const op = sequelize.Op;

let date_format = '\'%d %M %H:%i\'';



class Dao
{
	//returns array of all users in the database
	getAllUsers()
	{
		return model.UserModel.findAll();
	}



	//returns array of all events in database
	getAllEvents()
	{
		return model.EventModel.findAll({order: [['startTime', 'ASC']]});
	}



	//returns a user if userid and username matches, else return null
	findUser(userId, username)
	{
		model.UserModel.findAll({where: {[op.and]: [{userId: userId}, {username: username}]}})
		     .then(user =>
		     {
			     if (user.length === 1)
			     {
				     return user;
			     }
			     return null;
		     });
	}



	//returns true if user was created, false if something went wrong
	createUser(user)
	{
		return model.UserModel.create(
			{
				username: user.username,
				password: user.password,
				salt: user.salt,
				email: user.email
			}
		).then(response => response.id !== null)
		            .catch(error =>
		            {
			            console.error(error);
			            return false;
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
		).then(created => ({insertId: (created.id)}));
	}



	findEventsBySearch(searchText)
	{
		model.EventModel.findAll({
			where: {[op.or]: [{eventName: {[op.like]: `%${searchText}%`}}, {description: {[op.like]: `%${searchText}%`}}]},
			order: [['startTime', 'ASC']]
		}).then(events => {return events;})
		     .catch(error =>
		     {
			     console.error(error);
			     return null;
		     });
	}



	//chekcs if username and password match, then reuturns true or false
	loginOk(email, password)
	{
		model.UserModel.findAll({where: {[op.and]: [{email: email}, {password: password}]}}).then(response =>
		{
			return response.length === 1;
		}).catch(error =>
		{
			console.error(error);
			return false;
		});
	}



	getTicketsForEvent(eventId)
	{
		return model.TicketModel.findAll({where: {eventId: eventId}})
		            .then(tickets => tickets)
		            .catch(error => console.error(error));
	}



	getSaltByEmail(email)
	{
		model.UserModel.findAll({where: {email: email}, attributes: ['salt']})
		     .then(salt => {return salt;})
		     .catch(error =>
		     {
			     console.error(error);
			     return null;
		     });
	}
}



module.exports = Dao;


