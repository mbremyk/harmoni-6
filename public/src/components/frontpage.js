import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, service} from '../services';



export class LandingPage extends Component
{
	events = [];

	render()
	{
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
					<Row>
						<Col>

							<Form.Control placeholder="Søk etter arragement"/>

						</Col>
					</Row>

				</Container>


				<Container>


					<Row>

						{this.events.map(event => (
							<EventInfo image= {event.image}
							           title= {event.title}
							           address={event.address}
							           price= "0"
							           age_limit={event.ageLimit}
							           start_date={event.startTime}
							           end_date={event.endTime}  />
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
			.catch((error) => <Alert variant="danger"> error.message </Alert>);



	}

	logIn()
	{
		//history.push('/logg-inn');

	}

}
