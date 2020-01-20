import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert, Image, Table, ListGroupItem} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, RiderItem, service, Ticket, User} from '../services';
import {authService} from "../AuthService";
import {HarmoniNavbar} from "./navbar";

const jwt = require("jsonwebtoken");


export class RiderPage extends Component {

    userId = jwt.decode(authService.getToken()).userId;
    state = {
        inputs: ['input-0'],
        riderItems: [],
        currentItem: ''


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
                this.setState({riderItems: riderItems});

                this.state.riderItems.map(item => console.log(item));

            })
            .catch(error => console.log(error));
    }

    appendInput() {
        var newInput = `input-${this.state.inputs.length}`;
        this.setState(prevState => ({inputs: prevState.inputs.concat([newInput])}));
    }

    saveItems() {

        this.setState({riderItems: [...this.state.riderItems, new RiderItem(this.props.match.params.id, this.userId, this.state.currentItem)]});
        this.setState({currentItem: ''});
        this.state.riderItems.map(item => console.log(item));


    }

    handleInputChange(event) {
        this.setState({currentItem: event.target.value})
    }

    saveRider() {
        service
            .addRiderItems(this.state.riderItems)
            .then(() => this.props.history.push("/arrangement/" + this.props.match.params.id))
            .catch(error => console.log(error));
    }

    renderRider() {
        if (this.state.riderItems.length !== 0) {
            return (
                <div>
                    <HarmoniNavbar/>
                    <Container>
                        <h1 className="font-weight-bold text-center">Din Rider</h1>
                        <Form.Group>
                            <React.Fragment>
                                {this.state.riderItems.map(item =>

                                    <ListGroupItem>
                                        {item.item}
                                    </ListGroupItem>
                                )}
                            </React.Fragment>
                        </Form.Group>
                    </Container>
                </div>
            );


        } else {
            return (
                <div>
                    <HarmoniNavbar/>
                    <Container>
                        <Form>
                            <Form.Group as={Col} sm={"12"}>
                                <h1 className="font-weight-bold text-center">Rider</h1>
                            </Form.Group>

                            <Form.Group>
                                <React.Fragment>
                                    {this.state.riderItems.map(item =>

                                        <ListGroupItem>
                                            {item.item}
                                        </ListGroupItem>
                                    )}
                                </React.Fragment>
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

                    </Container>
                </div>
            );

        }


    }


}