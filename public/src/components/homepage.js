import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, service, Ticket} from '../services';
import {authService} from '../AuthService'

const jwt = require("jsonwebtoken");


export class HomePage extends Component {
    myEvents = [];
    allEvents = [];


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
                    {this.myEvents.map(event => (
                        <EventInfo

                            link={event.eventId}
                            imageUrl={event.imageUrl}
                            title={event.eventName}
                            address={event.address}
                            age_limit={event.ageLimit}
                            start_date={event.startTime}
                            end_date={event.endTime}
                            uploaded={event.createdAt}
							myEvent = {true}

                        />
                    ))}
                </Row>


                <Row>
                    <Col md={{span: 12, offset: 4}}>
                        <h1>Andre Arrangementer</h1>
                    </Col>
                </Row>
                <Row>
                    {this.getOtherEvents().map(event =>



                        <EventInfo

                            link={event.eventId}
                            imageUrl={event.imageUrl}
                            title={event.eventName}
                            address={event.address}
                            age_limit={event.ageLimit}
                            start_date={event.startTime}
                            end_date={event.endTime}
                            uploaded={event.createdAt}
							myEvent={false}

                        />
                    )}
                </Row>


            </Container>


        );

    }

    mounted() {
		let token = jwt.decode(authService.getToken());

		service
			.getEventsByOrganizer(token.userId)
			.then(myEvents => (this.myEvents = myEvents))
			.catch((error) => console.log(error));

		this.getAllEvents()



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
		let otherEvents = this.allEvents.filter(e => e.organizerId !== token.userId)
		return otherEvents;

	}




}
