import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert, Image} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, service, Ticket} from '../services';
import {authService} from "../AuthService";

const jwt = require("jsonwebtoken");


export class EventPage extends Component {
    e = new Event();
    personnel = [];
    isPersonnel = false;

    render() {
        if (!this.e) {
            return null
        } else if (this.e) {
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
        } else if (this.checkForId()) {
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
                            <h4>Ass</h4>
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
    }


    mounted() {

        service
            .getEventByEventId(this.props.match.params.id)
            .then(e => (this.e = e))
            .catch((error) => console.log(error));
        this.getPersonnelForEvent();
        console.log(this.checkForId());


    }

    getPersonnelForEvent() {
        service
            .getPersonellForEvent(this.props.match.params.id)
            .then(personnel => (this.personnel = personnel))
            .catch((error) => console.log(error));

    }

    getArtistsForEvent() {
        //TODO
    }

    checkForId() {
        let token = jwt.decode(authService.getToken())
        this.personnel.map(person => {
                if (person.personellId == token.userId) {
                    return true;
                }
                return false;
            }
        )


    }

}

