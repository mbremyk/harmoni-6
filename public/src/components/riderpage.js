import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, ListGroupItem, ListGroup, Card} from "react-bootstrap";
import {HarmoniNavbar} from "./navbar";
import * as React from 'react';
import {Event, RiderItem, service} from '../services';
import {authService} from "../AuthService";
const jwt = require("jsonwebtoken");


export class RiderPage extends Component {

    userId = jwt.decode(authService.getToken()).userId;
    state = {
        inputs: ['input-0'],
        oldItems: [],
        currentItem: '',
        isConfirmed: false,
        newItems: [],
        event: new Event(),


    };


    render() {

        return <div>
            <HarmoniNavbar/>
            {this.renderRider()}
        </div>


    }

    mounted() {
        service
            .getRiderItems(this.props.match.params.eventid, this.props.match.params.artistid)
            .then(riderItems => {
                this.setState({oldItems: riderItems});
                this.getEvent();

                this.state.oldItems.map(item => {
                    if (item.confirmed == true || item.confirmed == false) {
                        this.setState({isConfirmed: true});
                    }
                });

            })
            .catch(error => console.log(error));
    }


    //saves the new input from the artist in a new array that gets send to the database when saveRider() is used
    saveItems() {

        this.setState({newItems: [...this.state.newItems, new RiderItem(this.props.match.params.eventid, this.props.match.params.artistid, this.state.currentItem)]});
        this.setState({currentItem: ''});


    }

    handleInputChange(event) {
        this.setState({currentItem: event.target.value})
    }

    //sends the new items to the database
    saveRider() {
        service
            .addRiderItems(this.state.newItems)
            .then(() => this.props.history.push("/arrangement/" + this.props.match.params.eventid))
            .catch(error => console.log(error));
    }


    renderRider() {
        //only renders if a artist is viewing the page
        if (this.props.match.params.artistid == this.userId) {
            //only if the organizer has confirmed/denied items the artist wont get the chance to edit the rider anymore.
            //they will get a list of the items showing what they can expect when they come backstage
            if (this.state.isConfirmed) {
                return (
                    <div>
                        <Container>
                            <Card className="p-4">
                                <h1 className="font-weight-bold text-center">Din Rider</h1>
                                <Form.Group>
                                    <ListGroup>
                                        <React.Fragment>
                                            {this.state.oldItems.filter(item => item.confirmed == 1).map(item =>

                                                <ListGroupItem>
                                                    <Row>
                                                        <Col>
                                                            {item.item}
                                                        </Col>
                                                        <Col sm={4}>
                                                            <h6 className="text-success">Godkjent av arrangør</h6>
                                                        </Col>

                                                    </Row>
                                                </ListGroupItem>
                                            )}
                                        </React.Fragment>
                                        <React.Fragment>
                                            {this.state.oldItems.filter(item => item.confirmed == 0).map(item =>

                                                <ListGroupItem>
                                                    <Row>
                                                        <Col>
                                                            {item.item}
                                                        </Col>
                                                        <Col sm={4}>
                                                            <h6 className="text-danger">Avslått av arrangør</h6>
                                                        </Col>

                                                    </Row>
                                                </ListGroupItem>
                                            )}
                                        </React.Fragment>
                                    </ListGroup>

                                </Form.Group>
                            </Card>
                        </Container>
                    </div>
                );


            } else {
                //if the organizer hasnt looked at it they artist will have the chance to add more items to the list
                return (
                    <div>
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

            //only renders if an organizer is viewing the page
        } else if (this.state.event.organizerId == this.userId) {
            //renders if a organizer has not confirmed the items
            if (this.state.isConfirmed === false && this.state.oldItems.length !== 0) {
                return (
                    <div>
                        <Container>
                            <Card className="p-4">
                                <h1 className="font-weight-bold text-center">Din Rider</h1>
                                <Form.Group>
                                    <ListGroup>
                                        {this.state.oldItems.map(item =>


                                            <ListGroupItem>

                                                <Form.Check type="checkbox" label={item.item}
                                                            onClick={() => this.addConfirmedItem(item)}/>


                                            </ListGroupItem>
                                        )}
                                    </ListGroup>

                                </Form.Group>
                                <Button variant="success" onClick={() => this.saveConfirmedItems()}>Godkjenn</Button>
                            </Card>
                        </Container>
                    </div>
                );

                //if he has confirmed the items the page will render a list with accepted and declined items
            } else if (this.state.isConfirmed === true && this.state.oldItems.length !== 0) {
                return (
                    <div>
                        <Container>
                            <Card className="p-4">
                                <h1 className="font-weight-bold text-center">Rider</h1>
                                <Form.Group>
                                    <ListGroup>
                                        <React.Fragment>
                                            {this.state.oldItems.filter(item => item.confirmed == 1).map(item =>

                                                <ListGroupItem>
                                                    <Row>
                                                        <Col>
                                                            {item.item}
                                                        </Col>
                                                        <Col sm={4}>
                                                            <h6 className="text-success">Godkjent</h6>
                                                        </Col>

                                                    </Row>
                                                </ListGroupItem>
                                            )}
                                        </React.Fragment>
                                        <React.Fragment>
                                            {this.state.oldItems.filter(item => item.confirmed == 0).map(item =>

                                                <ListGroupItem>
                                                    <Row>
                                                        <Col>
                                                            {item.item}
                                                        </Col>
                                                        <Col sm={4}>
                                                            <h6 className="text-danger">Avslått</h6>
                                                        </Col>

                                                    </Row>
                                                </ListGroupItem>
                                            )}
                                        </React.Fragment>
                                    </ListGroup>

                                </Form.Group>
                            </Card>
                        </Container>
                    </div>
                );
            } else if (this.state.oldItems.length === 0) {

                return (
                    <div>
                        <Container>
                            <Card className={"m-4"}>
                                <h1 className="font-weight-bold text-center">Artisten har ikke lastet opp en rider</h1>
                            </Card>
                        </Container>
                    </div>
                );
            }

        }


    }


    getEvent() {
        service
            .getEventByEventId(this.props.match.params.eventid)
            .then(event => {
                this.setState({event: event});
            })
            .catch((error) => console.log(error));
    }

    //sends the confirmed items to the database, everything unchecked will be marked false
    saveConfirmedItems() {
        service
            .confirmRiderItems(this.state.oldItems)
            .then(() => this.props.history.push("/arrangement/" + this.props.match.params.eventid))
            .catch(error => console.log(error));
    }


    addConfirmedItem(item) {

        if (item.confirmed) {
            item.confirmed = false;

        } else if (!item.confirmed) {
            item.confirmed = true;

        } else if (item.confirmed == null) {

            item.confirmed = true


        }
    }


}