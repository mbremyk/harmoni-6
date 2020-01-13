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

	e = new Event();

	render()

	{
		if (!this.e) return null;
		return (



			<Container>

						<Image src={this.e.imageUrl} height="auto" width="100%"/>

				<Row>
					<Col>
						<h1>{this.e.eventName}</h1>
					</Col>
				</Row>
				<Row>
					<Col md={4}>
						<h4>fra {this.e.startTime} til {this.e.endTime}</h4>
					</Col>

					<Col md={{offset: 6}}>
						<h4>Aldersgrense {this.e.ageLimit}</h4>
					</Col>


				</Row>

				<Row>
					<Col>
					<h2>{this.e.address}</h2>
					</Col>
				</Row>
				<Row>
					<Col>
						<h4>Artist 1 og Artist 2</h4>
					</Col>
				</Row>

				<Row>
					<Col>
					<p>{this.e.description}</p>
					</Col>
				</Row>



			</Container>


		);
		}


	mounted()
	{

		service
			.getEventByEventId(this.props.match.params.id)
			.then(e => (this.e = e))
			.catch((error) => console.log(error));
		console.log(this.e.ageLimit)


	}
}

