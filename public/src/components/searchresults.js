import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, service, Ticket} from '../services';
import {authService} from '../AuthService'
import {SortedEventView} from "./sortedeventview";
import {navbar} from "./navbar";



const jwt = require("jsonwebtoken");


export class SearchResults extends  Component{
    state = {
        events: false
    };

    render() {
        if(this.state.events){
        console.log("render: " +  this.state.events);
        return <SortedEventView events={this.state.events}/>
        }
        else{ return null}
    }

    mounted() {
        console.log('Search input: ' + this.props.match.params.input);
        service
            .searchForEvents(this.props.match.params.input)
            .then(events => {
                this.setState({events: events});
                console.log("search mounted");
                console.log(events)
            })
            .catch((error) => console.log(error));
    }
}