import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert, Image, Table} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, service, Ticket, User} from '../services';
import {authService} from "../AuthService";
import {HarmoniNavbar} from "./navbar";

const jwt = require("jsonwebtoken");


export class RiderPage extends Component {

    state = {
        counter: Array(1)
    };

    incrementCounter = () => {
        this.setState({counter: Array(this.state.counter.length + 1)})
    };

    render() {


        return (
            <div>
                <HarmoniNavbar/>
                <Container>
                    <Form>
                        <Form.Group as={Col} sm={"12"}>
                            <h1 className="font-weight-bold text-center">Rider</h1>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Button variant={"success"} onClick={this.incrementCounter}>+</Button>


                        </Form.Group>
                        <Form.Group as={Col}>
                            <Button variant={"primary"}>Lagre Rider</Button>


                        </Form.Group>


                    </Form>
                </Container>
            </div>
        );

    }

    mounted() {
    }

    addInputField() {
        return <Form.Control/>

    }


}