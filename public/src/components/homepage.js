import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, service, Ticket} from '../services';
import {authService} from '../AuthService'
import {SortedEventView} from "./sortedeventview";
const jwt = require("jsonwebtoken");


export class HomePage extends Component {
	myEvents = [];
	allEvents = [];
	otherEvents = false;


	/*
     <Container>
     <Row>
     <Col>

     <Form.Control placeholder="Søk etter arragement"/>


     </Col>
     </Row>

     </Container>
     */

	render() {
			return (


				<Container>


					<Row>
						<Col md={{span: 12, offset: 4}}>
							<h1>Mine Arrangementer</h1>
						</Col>
					</Row>


					<Row>
						<SortedEventView myEvent={true} events={this.myEvents}/>

					</Row>


					<Row>
						<Col md={{span: 12, offset: 4}}>
							<h1>Andre Arrangementer</h1>
						</Col>
					</Row>

					<SortedEventView events={this.getOtherEvents()}/>


				</Container>


			);

	}


	mounted() {
		let token = jwt.decode(authService.getToken());

		service
			.getEventsByOrganizer(token.userId)
			.then(myEvents => (this.myEvents = myEvents))
			.catch((error) => console.log(error));

		this.getAllEvents();




	}

	//gets all the events in the database and gives the array allEvents this value
	getAllEvents() {
		service
			.getEvents()
			.then(otherEvents => (this.allEvents = otherEvents))
			.catch((error) => console.log(error));

	}

	//checks if the event is organized by the logged in user, if not it goes in this array
	getOtherEvents()
	{
		let token = jwt.decode(authService.getToken());
		let otherEvents = this.allEvents.filter(e => e.organizerId !== token.userId);
		return otherEvents;

	}




}
