import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert, Image, Table} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, service, Ticket, User} from '../services';
import {authService} from "../AuthService";

const jwt = require("jsonwebtoken");


export class EventPage extends Component {
    e = new Event();
    personnel = [];
    isPersonnel = false;
    isOrganizer = false;
    isArtist = false;
    user = new User();

    render() {
        if (!this.e) {
            return null
        } else if (this.e) {
            if (!this.isPersonnel && !this.isOrganizer) {
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

            } else if (this.isPersonnel == true) {
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
                        <Row>
                            <Table responsive>
                                <thead>
                                <tr>

                                    <th>Ansvarsområdet</th>
                                    <th>Epost</th>

                                </tr>
                                </thead>
                                <tbody>

                                {this.personnel.map(person => (
                                    <tr>
                                        <td>{person.role}</td>
                                        <td>{this.user.email}</td>


                                    </tr>

                                ))}

                                </tbody>


                            </Table>
                        </Row>


                    </Container>


                );


            } else if (this.isOrganizer == true) {
                return (

                    <Container>

                        <Image src={this.e.imageUrl} height="auto" width="100%"/>

                        <Row>
                            <Col>
                                <h1>{this.e.eventName}</h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <a href="" download>
                                    <Button variant="primary" aria-label="Left Align" title="Last Ned">
                                        <span className="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>
                                        Kontrakt
                                    </Button>
                                </a>
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
                                <h2>Adresse: {this.e.address}</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h4>arrangør yo</h4>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <p>{this.e.description}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h2>Personnel</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <Table responsive>
                                <thead>
                                <tr>

                                    <th>Ansvarsområdet</th>
                                    <th>Epost</th>

                                </tr>
                                </thead>
                                <tbody>

                                {this.personnel.map(person => (
                                    <tr>
                                        <td>{person.role}</td>
                                        <td>{this.user.email}</td>


                                    </tr>

                                ))}

                                </tbody>


                            </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button href={"/endre-arrangement/" + this.props.match.params.id} variant="primary">Endre Arragement</Button>
                            </Col>
                            <Col>
                                <Button variant="danger">Avlys Arrangement</Button>
                            </Col>
                        </Row>



                    </Container>


                );

            } else if (this.isArtist == true) {
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
                                <h4>arrangør yo</h4>
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
    }


    mounted() {

        service
            .getEventByEventId(this.props.match.params.id)
            .then(e => {
                this.e = e
                let token = jwt.decode(authService.getToken());
                if (this.e.organizerId == token.userId) {
                    this.isOrganizer = true;
                    console.log(this.isOrganizer);
                }
            })
            .catch((error) => console.log(error));
        this.getPersonnelForEvent();


    }

    //works
    getPersonnelForEvent() {
        service
            .getPersonellForEvent(this.props.match.params.id)
            .then(personnel => {
                this.personnel = personnel;
                let token = jwt.decode(authService.getToken());
                this.personnel.map(person => {
                    if (person.personnelId == token.userId) {
                        this.isPersonnel = true;
                        console.log(this.isPersonnel);
                    }
                });


            })
            .catch((error) => console.log(error));

    }

    getArtistsForEvent() {
        //TODO
    }

    getUser(id) {
        service.getUser(id)
            .then(e => {
                this.user = e;



            })
            .catch((error) => console.log(error));

    }




}

