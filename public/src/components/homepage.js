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
    myEvents = [];
    allEvents = [];


    render() {
        return (
            <div>
                <HarmoniNavbar/>
                <Row>
                    <Col>
                        <h1 className="text-center">Mine Arrangementer</h1>
                    </Col>
                </Row>
                <Row>
                    <SortedEventView myEvent={true} events={this.myEvents}/>

                </Row>
                <Row>
                    <Col>
                        <h1 className="text-center">Andre Arrangementer</h1>
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
            .then(myEvents => (this.myEvents = myEvents))
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
