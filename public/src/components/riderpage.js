import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert, Image, Table, ListGroupItem, ListGroup} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, RiderItem, service, Ticket, User} from '../services';
import {authService} from "../AuthService";
import {HarmoniNavbar} from "./navbar";
import Card from "react-bootstrap/Card";

const jwt = require("jsonwebtoken");


export class RiderPage extends Component {

    userId = jwt.decode(authService.getToken()).userId;
    state = {
        inputs: ['input-0'],
        oldItems: [],
        currentItem: '',
        isConfirmed: false,
        newItems: []


    };


    render() {

        return <div>
            {this.renderRider()}
        </div>


    }

    mounted() {
        service
            .getRiderItems(this.props.match.params.id, this.userId)
            .then(riderItems => {
                this.setState({oldItems: riderItems});

                this.state.oldItems.map(item => {
                    if (item.confirmed == true || item.confirmed == false) {
                        this.setState({isConfirmed: true});
                    }
                    console.log(item)
                });

            })
            .catch(error => console.log(error));
    }


    saveItems() {

        this.setState({newItems: [...this.state.newItems, new RiderItem(this.props.match.params.id, this.userId, this.state.currentItem)]});
        this.setState({currentItem: ''});


    }

    handleInputChange(event) {
        this.setState({currentItem: event.target.value})
    }

    saveRider() {
        service
            .addRiderItems(this.state.newItems)
            .then(() => this.props.history.push("/arrangement/" + this.props.match.params.id))
            .catch(error => console.log(error));
    }

    renderRider() {
        if (this.state.isConfirmed) {
            return (
                <div>
                    <HarmoniNavbar/>
                    <Container>
                        <h1 className="font-weight-bold text-center">Din Rider</h1>
                        <Form.Group>
                            <ListGroup>
                                <React.Fragment>
                                    {this.state.oldItems.map(Olditem =>

                                        <ListGroupItem>
                                            {Olditem.item}
                                        </ListGroupItem>
                                    )}
                                </React.Fragment>
                            </ListGroup>

                        </Form.Group>
                    </Container>
                </div>
            );


        } else {
            return (
                <div>
                    <HarmoniNavbar/>
                    <Container>
                        <Card className="p-4">
                            <Form>
                                <Form.Group as={Col} sm={"12"}>
                                    <h1 className="font-weight-bold text-center">Rider</h1>
                                </Form.Group>

                                <Form.Group>
                                    <ListGroup>
                                        <React.Fragment>
                                            {this.state.oldItems.map(item =>

                                                <ListGroupItem>
                                                    {item.item}
                                                </ListGroupItem>
                                            )}
                                        </React.Fragment>

                                        <React.Fragment>

                                            {this.state.newItems.map(item =>
                                                (
                                                    <ListGroupItem>
                                                        {item.item}
                                                    </ListGroupItem>
                                                ))}
                                        </React.Fragment>
                                    </ListGroup>

                                </Form.Group>

                                <Form.Group>
                                    <Row>
                                        <Col><Form.Control value={this.state.currentItem}
                                                           onChange={this.handleInputChange}/></Col>
                                        <Col sm={2}><Button variant="success" onClick={this.saveItems}>Legg
                                            til i rider</Button></Col>
                                    </Row>

                                </Form.Group>

                                <Form.Group>
                                    <Button variant="primary" onClick={() => this.saveRider()}>
                                        Lagre Rider
                                    </Button>
                                </Form.Group>

                            </Form>
                        </Card>

                    </Container>
                </div>
            );

        }


    }


}