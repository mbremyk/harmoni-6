import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert} from "react-bootstrap";
import {SortedEventView, SortingOptions} from './sortedeventview';
import * as React from 'react';
import {Event, service, Ticket} from '../services';

export class LandingPage extends Component {
	state = {
		sortOption: {field: '', order: 'asc'},
		events: []
	};

	tickets = [];
	searchevents = [];

	render() {
		return (
			<div>
				<div className="landingpage">
					<Container>
						<Row style={{padding: "5em"}}>
							<Col>
								<h1 className="HarmoniLogo display-3 text-center">Harmoni</h1>
							</Col>
						</Row>
						<Row style={{padding: "3em"}}>
							<Col className="text-center">
								<Button variant="primary"
								        size="lg"
								        onClick={() => this.logIn()} href="logg-inn">Logg inn</Button>
							</Col>
						</Row>
						<Row style={{padding: "3em"}}>
							<Col className="text-center">
								<h2>Logg inn for å se dine arrangementer</h2>
							</Col>
						</Row>
					</Container>
				</div>
				<SortedEventView/>
			</div>
		);
	}


	mounted() {
		service
			.getEvents()
			.then(events => (this.handleEvents(events)))
			.catch((error) => console.log(error));
	}

	getTicketPrice(eventId) {
		service
			.getTicketToEvent(eventId)
			.then(tickets => {
				this.tickets = tickets;
				let lowestPrice = tickets[0].price;
				for (let i = 0; i < tickets.length; i++) {
					if (tickets[i].price < lowestPrice) {
						lowestPrice = tickets[i].price;
						console.log(lowestPrice);
					}
				}
				return lowestPrice;
			})
			.catch((error) => console.log(error));
	}
}
