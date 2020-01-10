import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert, Image} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, service, Ticket} from '../services';





export class EventPage extends Component
{
	constructor(props){
		super(props);

		this.state = {
			id : this.props.match.params.id
		}
	}

	event;

	render()
	{
		return (



			<Container>

						<Image src={this.event.imageUrl} height="auto" width="100%"/>

				<Row>
					<Col>
						<h1>{this.event.eventName}</h1>
					</Col>
				</Row>
				<Row>
					<Col md={4}>
						<h4>fra {this.event.startTime} til {this.event.endTime}</h4>
					</Col>

					<Col md={{offset: 6}}>
						<h4>Aldersgrense {this.event.ageLimit}</h4>
					</Col>


				</Row>

				<Row>
					<Col>
					<h2>{this.event.address}</h2>
					</Col>
				</Row>
				<Row>
					<Col>
						<h4>Artist 1 og Artist 2</h4>
					</Col>
				</Row>

				<Row>
					<Col>
					<p>{this.event.description}</p>
					</Col>
				</Row>



			</Container>


		);

	}
	mounted()
	{
		service
			.getEventByEventId(this.props.match.params.id)
			.then(event => (this.event = event))
			.catch((error) => console.log(error));

	}
}

