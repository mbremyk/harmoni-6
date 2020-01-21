import {Component} from "react-simplified";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {DownloadWidget} from '../widgets.js';
import * as React from 'react';
import {Event, service, User} from '../services';
import {authService} from "../AuthService";
import {HarmoniNavbar} from "./navbar";
import NavLink from "react-bootstrap/NavLink";
import {MailForm} from "../widgets";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

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
                        <Card className='p-2'>
                            <div style={{overflow: 'hidden', height: '620px'}}>
                                <Image src={this.currentEvent.imageUrl}/>
                            </div>

                            <div className="p-4">
                            <h1 className="display-4 text-center m-4 text-body">{this.currentEvent.eventName}</h1>

                            <Row>
                                <Col lg={8}>
                                    {this.RenderArtist()}

                                    <div className="ml-3">
                                        {this.currentEvent.description}
                                    </div>

                                </Col>
                                <Col>
                                    <ListGroup>
                                        <ListGroup.Item><h6><b>Fra:</b> {this.formatTime(this.currentEvent.startTime)}</h6></ListGroup.Item>
                                        <ListGroup.Item><h6><b>Til:</b> {this.formatTime(this.currentEvent.endTime)}</h6></ListGroup.Item>
                                        <ListGroup.Item><h6><b>Adresse:</b> {this.currentEvent.address}</h6></ListGroup.Item>
                                        <ListGroup.Item>{this.RenderAgeLimit()}</ListGroup.Item>
                                        <ListGroup.Item><h6><b>Arrangør:</b> {this.user.username}</h6></ListGroup.Item>
                                        <ListGroup.Item><h6><b>Email:</b> {this.user.email}</h6></ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>

                            <div className='mt-5'>
                                {this.ShowArtist()}
                                {this.ShowPersonnel()}
                                {this.EditButton()}
                                {this.isOrganizer? <MailForm/> : <div/>}
                            </div>
                            </div>
                        </Card>
                    </Container>
                </div>
            );
        }
    }

    formatTime(input) {
        if(input == undefined){
            return 'ø';
        }

        let arr = input.split(' ');
        let date = arr[0];
        let time = arr[1];

        let dateArr = date.split('-');

        let year = dateArr[0];
        let month = dateArr[1];
        let day = dateArr[2];

        return day + '.' + month + '/' + year + ' klokka: '+ time;
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
                    if (person.artistId === token.userId) {
                        this.isArtist = true;
                    }
                });
                console.log("Er jeg artist? " + this.isArtist);

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
            return <Col><DownloadWidget artist={artistId} event={this.currentEvent.eventId}/></Col>;
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

    emailForm(){
        if(this.artists.length != 0){
            return <MailForm hasRecipients={true} description={"Info"} artists={this.artists} toggleable={true}/>
        }else{
            return null;
        }
    }

    //the button will render if the user is an artist or an organizer
    DownloadContract() {
        if (this.isOrganizer || this.isArtist) {
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
        } else {
            return <NavLink href="/"><h1 className="HarmoniLogo display-3 text-center m-5 text-body">Harmoni</h1></NavLink>
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
            return <h6><b>Aldersgrense:</b> {this.currentEvent.ageLimit}</h6>

        } else {
            return <h6><b>Aldersgrense:</b> Tillat for alle</h6>

        }
    }
}