import * as React from 'react';
import {Component} from "react-simplified";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import NavLink from "react-bootstrap/NavLink";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import {DownloadWidget} from '../widgets.js';
import {Event, service, User} from '../services';
import {authService} from "../AuthService";
import {HarmoniNavbar} from "./navbar";
import {MailForm} from "../widgets";

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
                            {this.renderImage()}

                            <div className="p-sm-4">
                                <h1 className="display-4 text-center m-4 text-body">{this.currentEvent.eventName}</h1>

                                {this.RenderArtist()}

                                <Row>
                                    <Col lg={8}>

                                    <div className="ml-3">
                                        <div>
                                            {this.currentEvent.description}
                                        </div>
                                        {this.renderPlaceDescription()}


                                    </div>
                                </Col>
                                <Col>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item><h6><b>Fra:</b> {this.formatTime(this.currentEvent.startTime)}
                                        </h6></ListGroup.Item>
                                        <ListGroup.Item><h6><b>Til:</b> {this.formatTime(this.currentEvent.endTime)}
                                        </h6></ListGroup.Item>
                                        <ListGroup.Item>{this.RenderAgeLimit()}</ListGroup.Item>
                                        <ListGroup.Item><h6><b>Adresse:</b> {this.currentEvent.address}</h6>
                                            <h6><b>By:</b> {this.currentEvent.city}</h6>
                                            <Button type="button" size="sm" onClick={this.addressClicked}>Åpne
                                                kart</Button></ListGroup.Item>
                                        <ListGroup.Item><h6><b>Kontakt Arrangør</b></h6><h6> {this.user.username}</h6>
                                            <h6><b>Email:</b> {this.user.email}</h6></ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>

                                <div className='mt-5'>
                                    {this.ShowArtist()}
                                    {this.ShowPersonnel()}
                                    <div className="text-center mt-4">{this.EditButton()}</div>
                                    {this.emailForm()}
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
                if(!!token) {
                    if (this.currentEvent.organizerId == token.userId) {
                        this.isOrganizer = true;
                        this.getPersonnelForEvent();
                        this.getArtistsForEvent();
                    }
                } else {
                    this.getPublicArtistsForEvent();
                }
            })
            .catch((error) => console.log(error));
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
            })
            .catch((error) => console.log(error));
    }

    getPublicArtistsForEvent() {
        service
            .getPublicGigs(this.props.match.params.id)
            .then(artists => {
                this.artists = artists;
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
                    <Button
                        className="m-2"
                        variant="primary"
                        size="sm"
                        href={"/arrangement/" + this.currentEvent.eventId + "/rider/" + artistId}>
                        Vis Rider
                    </Button>
                    <DownloadWidget type={"kontrakt"} artist={artistId} event={this.currentEvent.eventId}/>
                </div>);

        } else if (this.isOrganizer) {
            return (
                <div>
                    <Button
                        className="m-2"

                        variant="primary"
                        size="sm"
                        href={"/arrangement/" + this.currentEvent.eventId + "/rider/" + artistId}>
                        Vis Rider
                    </Button>

                    <DownloadWidget artist={artistId} event={this.currentEvent.eventId}/>
                </div>
            );

        }
    }

    //returns a list over artist and their contact info if there is any artist on the event
    ShowArtist() {
        if ((this.artists.length !== 0 && (this.isPersonnel || this.isArtist || this.isOrganizer))) {
            let artist = (this.artists.length > 1) ? 'Artister' : 'Artist';
            return <div>
                <Row className="mb-2">

                    <Col className="border-bottom border-top"><b>{'' + artist}</b></Col>
                    <Col className="border-bottom border-top"><b>Epost</b></Col>
                    <Col className="border-bottom border-top"> </Col>

                </Row>
                {this.artists.map(person => (
                    <Row className="mb-2">
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
                <Row className="tableheader" className="mb-2">
                    <Col className="border-bottom border-top"><b>Personell</b></Col>
                    <Col className="border-bottom border-top"><b> </b></Col>
                    <Col className="border-bottom border-top"><b>Oppgave</b></Col>
                </Row>

                {this.personnel.map(person => (

                    <Row className="mb-2">
                        <Col className>{person.user.username}</Col>
                        <Col className>{person.user.email}</Col>
                        <Col className>{person.role}</Col>
                    </Row>

                ))}
            </div>
        }
    }

    emailForm(){
        if (this.artists.length != 0 && this.isOrganizer) {
            return <MailForm hasRecipients={true} description={"Info"} recipients={this.artists.concat(this.personnel)}
                             toggleable={true}/>
        } else if (this.currentEvent.eventName && (this.isPersonnel || this.isArtist) && !this.isOrganizer) {
            return <MailForm hasRecipients={true} description={"Info"}
                             recipients={[this.getInfoAboutOrganizer(this.currentEvent.organizerId).username]}
                             toggleable={true}/>
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
            return <NavLink href="/"><h1 className="HarmoniLogo display-sm-3 text-center m-5 text-body">Harmoni</h1></NavLink>
        }
    }

    RenderArtist() {
        if (this.artists.length !== 0) {
            return (
                <Row className="m-3">
                    <Col><h5>{(this.artists.length > 1) ? 'Artister' : 'Artist'}:</h5></Col>
                    {this.artists.map(e => <Col><h5>{e.user.username}</h5></Col>)}
                </Row>
            )
        }
    }

    RenderAgeLimit() {
        if (this.currentEvent.ageLimit !== 0) {
            return <h6><b>Aldersgrense:</b> {this.currentEvent.ageLimit}</h6>

        } else {
            return <h6><b>Aldersgrense:</b> Tillat for alle</h6>

        }
    }

    addressClicked() {
        let res = (this.currentEvent.address + " " + this.currentEvent.city).split(" ");
        var url = "";
        res.map(i => {
            url += i + "-";
        });
        url = url.substring(0, url.length - 1);
        url = url.replace(/[^\w\s-]/g,'');
        window.open('https://www.google.com/maps/search/' + url);
    }

    renderImage() {
        if (this.currentEvent.imageUrl !== "") {
            return (
                <Image height='620px' src={this.currentEvent.imageUrl}/>

            );
        }
    }

    renderPlaceDescription() {
        if (this.currentEvent.placeDescription !== "") {
            return (
                <div className="mt-3">

                    <h6>Veibeskrivelse: </h6> {this.currentEvent.placeDescription}
                </div>

            );
        }
    }


}