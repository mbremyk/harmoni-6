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
    artists = [];
    isPersonnel = false;
    isOrganizer = false;
    isArtist = false;
    user = new User();

    render() {
        if (!this.e) {
            return null
        } else if (this.e) {

            if (this.isOrganizer) {
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

                            <Col>
                                <h6>Fra {this.e.startTime} Til {this.e.endTime}</h6>
                            </Col>

                            <Col>
                                <h6>Aldersgrense {this.e.ageLimit}</h6>
                            </Col>
                            <Col>
                                <h6>Adresse: {this.e.address}</h6>
                            </Col>
                            <Col>
                                <h6>Artister: {this.artists.map(artist => (

                                    <h5>{artist.user.username}</h5>

                                ))}</h6>
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
                                            <td>{person.user.email}</td>


                                        </tr>

                                    ))}

                                    </tbody>


                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h2>Artister</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table responsive>
                                    <thead>
                                    <tr>

                                        <th>Navn</th>
                                        <th>Epost</th>

                                    </tr>
                                    </thead>
                                    <tbody>

                                    {this.artists.map(person => (
                                        <tr>
                                            <td>{person.user.username}</td>
                                            <td>{person.user.email}</td>


                                        </tr>

                                    ))}

                                    </tbody>


                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button href={"/endre-arrangement/" + this.props.match.params.id} variant="primary">Endre
                                    Arragement</Button>
                            </Col>
                            <Col>
                                <Button variant="danger">Avlys Arrangement</Button>
                            </Col>
                        </Row>


                    </Container>


                );
            } else if ((this.isArtist && this.isPersonnel || this.isArtist)) {
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

                            <Col>
                                <h6>Fra {this.e.startTime} Til {this.e.endTime}</h6>
                            </Col>

                            <Col>
                                <h6>Aldersgrense {this.e.ageLimit}</h6>
                            </Col>
                            <Col>
                                <h6>Adresse: {this.e.address}</h6>
                            </Col>
                            <Col>
                                <h6>Artister: {this.artists.map(artist => (

                                    <h5>{artist.user.username}</h5>

                                ))}</h6>
                            </Col>


                        </Row>


                        <Row>
                            <Col>
                                <h4>{this.e.address}</h4>
                            </Col>
                        </Row>
                        <Row>

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
                                        <td>{person.user.email}</td>


                                    </tr>

                                ))}

                                </tbody>


                            </Table>
                        </Row>

                    </Container>


                );
            } else if (this.isPersonnel) {
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
                                <h6>Fra {this.e.startTime} Til {this.e.endTime}</h6>
                            </Col>

                            <Col>
                                <h6>Aldersgrense {this.e.ageLimit}</h6>
                            </Col>
                            <Col>
                                <h6>Adresse: {this.e.address}</h6>
                            </Col>
                            <Col>
                                <h6>Artister: {this.artists.map(artist => (

                                    <h5>{artist.user.username}</h5>

                                ))}</h6>
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
                                        <td>{person.user.email}</td>


                                    </tr>

                                ))}

                                </tbody>


                            </Table>
                        </Row>


                    </Container>


                );


            } else if (!this.isPersonnel && !this.isOrganizer) {
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
                                <h6>Fra {this.e.startTime} Til {this.e.endTime}</h6>
                            </Col>

                            <Col>
                                <h6>Aldersgrense {this.e.ageLimit}</h6>
                            </Col>
                            <Col>
                                <h6>Adresse: {this.e.address}</h6>
                            </Col>
                            <Col>
                                <h6>Artister: {this.artists.map(artist => (

                                    <h5>{artist.user.username}</h5>

                                ))}</h6>
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
        this.getArtistsForEvent();


    }

    //works
    getPersonnelForEvent() {
        service
            .getPersonnel(this.props.match.params.id)
            .then(personnel => {
                this.personnel = personnel;
                let token = jwt.decode(authService.getToken());
                this.personnel.map(person => {
                    if (person.personnelId == token.userId) {
                        this.isPersonnel = true;
                        console.log("Er jeg personnel? " + this.isPersonnel)

                    }
                });


            })
            .catch((error) => console.log(error));

    }

    getArtistsForEvent() {
        service
            .getGigForEvent(this.props.match.params.id)
            .then(artists => {
                this.artists = artists;
                let token = jwt.decode(authService.getToken());
                this.artists.map(person => {
                    if (person.artistId == token.userId) {
                        this.isArtist = true;
                        console.log("Er jeg artist? " + this.isArtist)
                    }
                });


            })
            .catch((error) => console.log(error));
    }

}

