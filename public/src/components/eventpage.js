import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert, Image, Table} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, service, Ticket, User} from '../services';
import {authService} from "../AuthService";
import {HarmoniNavbar} from "./navbar";

const jwt = require("jsonwebtoken");


export class EventPage extends Component {
    CurrentEvent = new Event();
    personnel = [];
    artists = [];
    isPersonnel = false;
    isOrganizer = false;
    isArtist = false;

    render() {
        if (!this.CurrentEvent) {
            return null
        } else if (this.CurrentEvent) {
            return (

                <div>
                    {this.RenderNavbar()}
                    <Container>

                        <Image src={this.CurrentEvent.imageUrl} height="auto" width="100%"/>

                        <Row>
                            <Col>
                                <h1>{this.CurrentEvent.eventName}</h1>
                            </Col>
                        </Row>
                        <Row>

                            <Col>
                                <h6>Fra {this.CurrentEvent.startTime} Til {this.CurrentEvent.endTime}</h6>
                            </Col>

                            <Col>
                                <h6>Aldersgrense {this.CurrentEvent.ageLimit}</h6>
                            </Col>
                            <Col>
                                <h6>Adresse: {this.CurrentEvent.address}</h6>
                            </Col>
                            <Col>
                                <h6>Artister: {this.artists.map(artist => (

                                    <h5>{artist.user.username}</h5>

                                ))}</h6>
                            </Col>
                        </Row>
                        {this.DownloadContract()}
                        <Row>
                            <Col>
                                <p>{this.CurrentEvent.description}</p>
                            </Col>
                        </Row>
                        {this.ShowArtist()}
                        {this.ShowPersonnel()}
                        {this.EditButton()}


                    </Container>
                </div>


            );


        }
    }

//checks if the person viewing the event is the organizer
    mounted() {

        service
            .getEventByEventId(this.props.match.params.id)
            .then(e => {
                this.CurrentEvent = e;
                let token = jwt.decode(authService.getToken());
                if (this.CurrentEvent.organizerId == token.userId) {
                    this.isOrganizer = true;
                }
                console.log('isOrganizer: ' + this.isOrganizer);
            })
            .catch((error) => console.log(error));
        console.log('getting personnel');
        this.getPersonnelForEvent();
        console.log('getting artists');
        this.getArtistsForEvent();


    }

//gets all the people working on that event and checks if the person viewing it is a part of the personnel
    getPersonnelForEvent() {
        service
            .getPersonnel(this.props.match.params.id)
            .then(personnel => {
                this.personnel = personnel;
                let token = jwt.decode(authService.getToken());
                this.personnel.map(person => {
                    if (person.personnelId == token.userId) {
                        this.isPersonnel = true;
                    }
                });
                console.log("Er jeg personnel? " + this.isPersonnel)
            })
            .catch((error) => console.log(error));

    }

//gets all the artist working on that event and checks if the person viewing it is a an artist
    getArtistsForEvent() {
        service
            .getGigForEvent(this.props.match.params.id)
            .then(artists => {
                this.artists = artists;
                let token = jwt.decode(authService.getToken());
                this.artists.map(person => {
                    if (person.artistId == token.userId) {
                        this.isArtist = true;
                    }
                });
                console.log("Er jeg artist? " + this.isArtist);

            })
            .catch((error) => console.log(error));
    }

    RiderButton(id) {
        let token = jwt.decode(authService.getToken());
        if (id == token.userId) {
            return <Button variant="primary">Legg til Rider</Button>;
        }
    }

//returns a list over artist and their contact info if there is any artist on the event
    ShowArtist() {
        if ((this.artists.length !== 0 && (this.isArtist || this.isOrganizer))) {
            return (<Row>
                <Col>
                    <Table responsive>
                        <thead>
                        <tr>

                            <th>Artist</th>
                            <th>Epost</th>

                        </tr>
                        </thead>
                        <tbody>

                        {this.artists.map(person => (
                            <tr>
                                <td>{person.user.username}</td>
                                <td>{person.user.email} {this.RiderButton(person.artistId)} </td>




                            </tr>

                        ))}

                        </tbody>


                    </Table>
                </Col>
            </Row>);
        }
    }

//returns a list over personnel and their contact info if there is any personnel on the event
    ShowPersonnel() {
        if ((this.personnel.length !== 0 && (this.isArtist || this.isPersonnel || this.isOrganizer))) {


            return <Row>
                <Col>
                    <Table responsive>
                        <thead>
                        <tr>

                            <th>Personnel</th>
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
        }

    }

    DownloadContract() {
        if (this.isOrganizer) {
            return <Row>
                <Col>
                    <a href="" download>
                        <Button variant="primary" aria-label="Left Align" title="Last Ned">
                            Last Ned Kontrakt
                        </Button>
                    </a>
                </Col>
            </Row>
        }
    }

    EditButton() {
        if (this.isOrganizer) {
            return <Row>
                <Col>
                    <Button href={"/endre-arrangement/" + this.props.match.params.id} variant="primary">Endre
                        Arragement</Button>
                </Col>
            </Row>
        }
    }

    RenderNavbar() {
        if (authService.loggedIn()) {
            return <HarmoniNavbar/>
        }
    }


}

