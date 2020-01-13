import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {SortingOptions} from './sortingOptions';

import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, service, Ticket} from '../services';





export class LandingPage extends Component
{
	state = {
		sortOption: {field: '', order: 'asc'},
		events : []
	};


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
		console.log("render kjørt!")
		return (

			<div>

				<div className="landingpage">

					<Container>


						<Row>
							<Col md={{span: 3, offset: 5}}>
								<h1> Harmoni </h1>
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
					<SortingOptions onSort={this.handleSortingOption}/>

					<Row>

						{this.state.events.map(event => (
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

	handleSortingOption = (option) =>{
		console.log(option);
		switch (option) {
			case 'PriceAsc':
				//TODO
				break;
			case 'PriceDesc':
				//TODO
				break;
			case 'AgeLimitAsc':
				this.setState({events: this.state.events.sort(this.compareValues('ageLimit'))});
				break;
			case 'AgeLimitDesc':
				this.setState({events: this.state.events.sort(this.compareValues('ageLimit', 'desc'))});
				break;
			case 'DateAsc':
				this.setState({events: this.state.events.sort(this.compareValues('startTime'))});
				break;
			case 'DateDesc':
				this.setState({events: this.state.events.sort(this.compareValues('startTime', 'desc'))});
				break;
			case 'AddressAsc':
				this.setState({events: this.state.events.sort(this.compareValues('address'))});
				break;
			case 'AddressDesc':
				this.setState({events: this.state.events.sort(this.compareValues('address', 'desc'))});
				break;
		}
	};

	compareValues(key, order = 'asc') {
		console.log(key);
		return function innerSort(a, b) {
			if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
				// property doesn't exist on either object
				console.log("No key found: comparator");
				return 0;
			}

			const varA = (typeof a[key] === 'string')
				? a[key].toUpperCase() : a[key];
			const varB = (typeof b[key] === 'string')
				? b[key].toUpperCase() : b[key];

			let comparison = 0;
			if (varA > varB) {
				comparison = 1;
			} else if (varA < varB) {
				comparison = -1;
			}
			return (
				(order === 'desc') ? (comparison * -1) : comparison
			);
		};
	}


	handleEvents = (events) => {
		this.setState({events : events})
	};

	mounted()
	{
		service
			.getEvents()
			.then(events => (this.handleEvents(events)))
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
