import {Component} from "react-simplified";
import {Row, Col} from "react-bootstrap";
import * as React from 'react';
import {service} from '../services';
import {authService} from '../AuthService'
import {SortedEventView} from "./sortedeventview";
import {HarmoniNavbar} from "./navbar";
import NavLink from "react-bootstrap/NavLink";

const jwt = require("jsonwebtoken");


export class HomePage extends Component {
    eventsUserOrganizes = [];
    eventsUserIsArtistOrPersonnel = [];
    allEvents = [];



    render() {
        if(!this.eventsUserOrganizes) return null;
        console.log(this.eventsUserOrganizes)
        return (
            <div>
                <HarmoniNavbar/>
                <Row className={"pt-5 pb-2"}>
                    <Col>
                        <a name="Arrangementer-jeg-organiserer"></a>
                        <h1 className="text-center">Arrangementer jeg organiserer</h1>
                    </Col>
                </Row>
                <Row>
                    <SortedEventView myEvent={true} events={this.eventsUserOrganizes}/>
                </Row>
                <Row className={"pt-5 pb-2"}>
                    <Col>
                        <a name="arrangementer-jeg-er-artist-eller-er-personell-for"></a>
                        <h1 className="text-center">Arrangementer jeg er artist eller er personell for</h1>
                    </Col>
                </Row>
                <Row>
                    <SortedEventView  events={this.eventsUserIsArtistOrPersonnel}/>
                </Row>
                <Row className={"pt-5 pb-2"}>
                    <Col>
                        <a name="andre-arrangementer"></a>
                        <h1 className="text-center">Andre arrangementer</h1>
                    </Col>
                </Row>
                <SortedEventView events={this.getOtherEvents()}/>
            </div>
        );

    }

     mounted() {
        let token = jwt.decode(authService.getToken());
        service
            .getEventsByOrganizer(token.userId)
            .then(e => this.eventsUserOrganizes = e)
            .catch((error) => console.log(error));

        service
             .getMyEventsByUserId(token.userId)
             .then(e => {this.eventsUserIsArtistOrPersonnel = e})
             .catch((error) => console.log(error));
        this.getAllEvents();
    }

    //gets all the events in the database and gives the array allEvents this value
    getAllEvents() {
        service
            .getEvents()
            .then(otherEvents => (this.allEvents = otherEvents))
            .catch((error) => console.log(error));
    }

    //checks if the event is organized by the logged in user, if not it goes in this array
    getOtherEvents() {
        let token = jwt.decode(authService.getToken());
        let otherEvents = this.allEvents.filter(e => e.organizerId !== token.userId);
        return otherEvents;
    }
}
