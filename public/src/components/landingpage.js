import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, service, Ticket} from '../services';





export class LandingPage extends Component
{
	events = [];
	tickets = [];
	searchevents = [];

	/*
	 <Container>
	 <Row>
	 <Col>

	 <Form.Control placeholder="Søk etter arragement"/>


	 </Col>
	 </Row>

	 </Container>
	 */

	render()
	{
		return (

			<div>

				<div className="landingpage">

					<Container>


						<Row>
							<Col md={{span: 3, offset: 5}}>
								<h1>Harmoni</h1>
							</Col>
						</Row>

						<Row>
							<Col md={{span: 3, offset: 5}}>
								<Button variant="primary"
								        size="lg"
								        onClick={() => this.logIn()} href="logg-inn">Logg inn</Button>
							</Col>

						</Row>
					</Container>

				</div>


				<Container>


					<Row>

						{this.events.map(event => (
							<EventInfo
								link={event.eventId}
								imageUrl={event.imageUrl}
								title={event.eventName}
								address={event.address}
								age_limit={event.ageLimit}
								start_date={event.startTime}
								end_date={event.endTime}
								uploaded={event.createdAt}
							/>
						))}


					</Row>
				</Container>
			</div>

		);

	}

	mounted()
	{
		service
			.getEvents()
			.then(events => (this.events = events))
			.catch((error) => console.log(error));



	}

	getTicketPrice(eventId)
	{
		service
			.getTicketToEvent(eventId)
			.then(tickets =>
			{
				this.tickets = tickets;
				let lowestPrice = tickets[0].price;
				for (let i = 0; i < tickets.length; i++)
				{
					if (tickets[i].price < lowestPrice)
					{
						lowestPrice = tickets[i].price;
						console.log(lowestPrice);
					}
				}
				/*this.tickets.map(ticket =>
				 {
				 if(ticket.price < lowestPrice)
				 {
				 lowestPrice = ticket.price;
				 console.log(lowestPrice);
				 }
				 });*/
				return lowestPrice;
			})
			.catch((error) => console.log(error));
	}

	/*
	 searchForEvents(input)
	 {
	 service
	 .searchForEvents(input)
	 .then(searchevents => this.searchevents = searchevents)
	 .catch((error) => console.log(error));

	 }
	 */

}
