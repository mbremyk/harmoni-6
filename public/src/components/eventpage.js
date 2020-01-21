import {Component} from "react-simplified";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {DownloadWidget} from '../widgets.js';
import * as React from 'react';
import {Event, service, User} from '../services';
import {authService} from "../AuthService";
import {HarmoniNavbar} from "./navbar";

const jwt = require("jsonwebtoken");


export class EventPage extends Component {
    currentEvent = new Event();
    personnel = [];
    artists = [];
    isPersonnel = false;
    isOrganizer = false;
    isArtist = false;
    user = new User();

    render() {
        if (!this.currentEvent) {
            return null
        } else if (this.currentEvent) {
            return (

                <div>
                    {this.RenderNavbar()}
                    <Container>

                        <Image src={this.currentEvent.imageUrl} height="auto" width="100%"/>

                        <Row>
                            <Col>
                                <h1>{this.currentEvent.eventName}</h1>
                            </Col>
                        </Row>
                        <Row>

                            <Col>
                                <Row>
                                    <h6>Fra: {this.currentEvent.startTime}<br/>Til : {this.currentEvent.endTime}</h6>
                                </Row>
                            </Col>

                            {this.RenderAgeLimit()}
                            <Col>
                                <h6>Adresse: {this.currentEvent.address}</h6>
                            </Col>
                            {this.RenderArtist()}
                            <Col>
                                <Row>
                                    <Col><h6>Arrangør: {this.user.username}</h6></Col>
                                    <Col><h6>Email: {this.user.email}</h6></Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p>{this.currentEvent.description}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {this.ShowArtist()}
                                {this.ShowPersonnel()}
                            </Col>
                        </Row>
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
                this.currentEvent = e;
                let token = jwt.decode(authService.getToken());
                this.getInfoAboutOrganizer(this.currentEvent.organizerId);
                if (this.currentEvent.organizerId == token.userId) {
                    this.isOrganizer = true;
                }


            })
            .catch((error) => console.log(error));
        this.getPersonnelForEvent();
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
            .getGigs(this.props.match.params.id)
            .then(artists => {
                this.artists = artists;
                let token = jwt.decode(authService.getToken());
                this.artists.map(person => {
                    if (person.artistId == token.userId) {
                        this.isArtist = true;
                    }
                });

            })
            .catch((error) => console.log(error));
    }

    getInfoAboutOrganizer(id) {
        service
            .getUser(id)
            .then(user => this.user = user)
            .catch((error) => console.log(error));
    }

    RenderButtons(artistId) {
        let token = jwt.decode(authService.getToken());
        if (artistId === token.userId) {
            return (
                <div>
                    <Button variant="primary"
                            size="sm"
                            href={"/arrangement/" + this.currentEvent.eventId + "/legg-til-rider"}>
                        Legg til Rider
                    </Button>
                    <DownloadWidget type={"kontrakt"} artist={artistId} event={this.currentEvent.eventId}/>
                </div>);

        } else if (this.isOrganizer) {
            return (
                <div>
                    <Button variant="primary">
                        Godkjenn Rider
                    </Button>
                    <Col>
                        <DownloadWidget artist={artistId} event={this.currentEvent.eventId}/>
                    </Col>
                </div>
            );

        }
    }


//returns a list over artist and their contact info if there is any artist on the event
    ShowArtist() {
        if ((this.artists.length !== 0 && (this.isArtist || this.isOrganizer))) {
            let artist = (this.artists.length > 1) ? 'Artister' : 'Artist';
            return <div>
                <Row>

                    <Col className="border-bottom border-top"><b>{'' + artist}</b></Col>
                    <Col className="border-bottom border-top"><b>Epost</b></Col>
                    <Col className="border-bottom border-top"> </Col>


                </Row>
                {this.artists.map(person => (
                    <Row>
                        <Col>{person.user.username}</Col>
                        <Col>{person.user.email} </Col>
                        <Col>{this.RenderButtons(person.artistId)}</Col>
                    </Row>
                ))}
            </div>

        }

    }


//returns a list over personnel and their contact info if there is any personnel on the event
    ShowPersonnel() {
        if ((this.personnel.length !== 0 && (this.isArtist || this.isPersonnel || this.isOrganizer))) {


            return <div>
                <Row className="tableheader">
                    <Col className="border-bottom border-top"><b>Personell</b></Col>
                    <Col className="border-bottom border-top"><b> </b></Col>
                    <Col className="border-bottom border-top"><b>Oppgave</b></Col>
                </Row>

                {this.personnel.map(person => (

                    <Row>
                        <Col className>{person.user.username}</Col>
                        <Col className>{person.user.email}</Col>
                        <Col className>{person.role}</Col>
                    </Row>

                ))}
            </div>


        }

    }

    //only organizers get to edit the event so this button will only render when the user is the organizer
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

    //renders navbar if a user is logged in
    RenderNavbar() {
        if (authService.loggedIn()) {
            return <HarmoniNavbar/>
        }
    }

    RenderArtist() {
        if (this.artists.length !== 0) {
            let artist = (this.artists.length > 1) ? 'Artister' : 'Artist';
            return <Col>
                <h6>{artist}: {this.artists.map(artist => (

                    <h5>{artist.user.username}</h5>

                ))}</h6>
            </Col>
        }

    }

    RenderAgeLimit() {
        if (this.currentEvent.ageLimit !== 0) {
            return <Col>
                <h6>Aldersgrense {this.currentEvent.ageLimit}</h6>
            </Col>

        } else {
            return <Col>
                <h6>Tillat for alle</h6>
            </Col>
        }


    }

    /*
        getRiderItems(artistid)
        {
            var riderItems = [];
            service.getRiderItems(this.currentEvent.eventId, artistid)
                .then(items => {
                    console.log(items);
                    riderItems = items;
                    return riderItems;
                })
                .catch((error) => console.log(error));
        }*/


}