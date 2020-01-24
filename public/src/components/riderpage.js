import {Component} from "react-simplified";
import {Button, Card, Col, Container, Form, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {HarmoniNavbar} from "./navbar";
import * as React from 'react';
import {Event, RiderItem, service, User} from '../services';
import {authService} from "../AuthService";
import Alert from "react-bootstrap/Alert";

const jwt = require("jsonwebtoken");


export class RiderPage extends Component {

    userId = jwt.decode(authService.getToken()).userId;

    state = {
        inputs: ['input-0'],
        currentItem: '',
        isConfirmed: false,
        oldItems: [],
        newItems: [],
        deleteItems: [],
        event: new Event(),
        artist: new User(),
        error: ''
    };


    render() {

        return <div>
            <HarmoniNavbar/>
            {this.renderRider()}

        </div>


    }

    mounted() {
        service.getRiderItems(this.props.match.params.eventid, this.props.match.params.artistid).then(riderItems => {
            this.setState({oldItems: riderItems});
            this.getEvent();
            this.getArtist();
            this.state.oldItems.map(item => {
                if (item.confirmed !== null) {
                    this.setState({isConfirmed: true});
                }
            });

        })
            .catch(error => console.error(error));
    }

    getEvent() {
        service
            .getEventByEventId(this.props.match.params.eventid)
            .then(event => {
                this.setState({event: event});
            })
            .catch((error) => console.error(error));
    }

    getArtist() {
        service
            .getUser(this.props.match.params.artistid)
            .then(artist => {
                this.setState({artist: artist});
            })
            .catch((error) => console.error(error));
    }

    returnToEvent() {
        this.props.history.push("/arrangement/" + this.props.match.params.eventid)
    }

    handleInputChange(event) {
        this.setState({currentItem: event.target.value})
    }

    removeItem(item) {
        if (this.state.oldItems.indexOf(item) >= 0) {
            //if item is in database
            this.state.oldItems.splice(this.state.oldItems.indexOf(item), 1);
            this.setState({deleteItems: [...this.state.deleteItems, item]});
        } else {
            //if item is'nt in database
            this.state.newItems.splice(this.state.newItems.indexOf(item), 1);
            this.setState({newItems: [...this.state.newItems]});
        }
    }

    addConfirmedItem(item) {
        item.confirmed = item.confirmed === null || !item.confirmed;
    }

    //sends the confirmed items to the database, everything unchecked will be marked false
    saveConfirmedItems() {
        service
            .confirmRiderItems(this.state.oldItems)
            .then(() => this.returnToEvent())
            .catch(error => console.error(error));
    }

    setError(message) {
        this.setState({error: message, errorType: 'danger'});
        if (!message) {
            return;
        }
        setTimeout(() => this.setState({error: '', errorType: 'primary'}), 4000);
    }

    //saves the new input from the artist in a new array that gets send to the database when saveRider() is used
    saveItem() {
        if (this.state.currentItem.trim() === '') return;
        if (this.state.newItems.some(item => this.state.currentItem.trim() === item.item) ||
            this.state.oldItems.some(item => this.state.currentItem.trim() === item.item)) {
            this.setError('Dette elementet finnes allerede');
            return
        }
        this.setState({newItems: [...this.state.newItems, new RiderItem(this.props.match.params.eventid, this.props.match.params.artistid, this.state.currentItem)]});
        this.setState({currentItem: ''});
    }

    //sends the new items to the database
    saveRider() {
        if (this.state.currentItem.trim() !== "") {
            if (!window.confirm("Er du sikker på at du vil lagre? \nDu har ett element som ikke er lagt til i riderene, dette vil ikke bli lagret dersom du trykker 'ok'.")) {
                return;
            }
        }

        let promises = [];
        if (Array.isArray(this.state.deleteItems) && this.state.deleteItems.length > 0) {
            promises.push(this.state.deleteItems.map(item => service.deleteRiderItem(item).catch(error => console.error(error))))
        }
        if (Array.isArray(this.state.newItems) && this.state.newItems.length > 0) {
            promises.push(service.addRiderItems(this.state.newItems).catch(error => console.error(error)))
        }
        Promise.all(promises).then(() => this.returnToEvent());
    }


    renderRider() {
        if (this.props.match.params.artistid == this.userId) {
            //only renders if a artist is viewing the page
            {
                return this.renderForArtist()
            }

        } else if (this.state.event.organizerId == this.userId) {
            //only renders if an organizer is viewing the page
            {
                return this.renderForOrganizer()
            }

        }
    }


    renderForArtist() {
        if (!this.state.isConfirmed) {
            //if the organizer hasnt approved the rider the artist will have the chance to add more items to the list
            return (
                <div>
                    <Container>
                        <Card className="p-5">
                            <Form>
                                <Form.Group as={Col} sm={"12"}>
                                    <h1 className="font-weight-bold text-center">Rider</h1>
                                </Form.Group>
                                <Form.Group>
                                    <ListGroup>
                                        <React.Fragment>

                                            {this.state.oldItems.map(item =>
                                                <ListGroupItem>
                                                    <Row>
                                                        <Col sm={1}>
                                                            <Button type="button" variant={"danger"}
                                                                    onClick={() => this.removeItem(item)}>X</Button>
                                                        </Col>
                                                        <Col>{item.item}</Col>
                                                    </Row>
                                                </ListGroupItem>
                                            )}

                                        </React.Fragment>
                                        <React.Fragment>

                                            {this.state.newItems.map(item =>
                                                <ListGroupItem>
                                                    <Row>
                                                        <Col sm={1}>
                                                            <Button type="button" variant={"danger"}
                                                                    onClick={() => this.removeItem(item)}>X</Button>
                                                        </Col>
                                                        <Col>{item.item}</Col>
                                                    </Row>
                                                </ListGroupItem>
                                            )}

                                        </React.Fragment>
                                    </ListGroup>
                                </Form.Group>
                                <Form.Group>
                                    {(this.state.error) ? <Alert style={{height: '3em'}}
                                                                 variant={this.state.errorType}>{this.state.error}</Alert> : null}
                                    <Row>
                                        <Col><Form.Control value={this.state.currentItem}
                                                           onChange={this.handleInputChange}/></Col>
                                        <Col sm={2}><Button variant="primary" onClick={this.saveItem}>
                                            Legg til i Rider</Button></Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group>
                                    <div className="text-center">
                                        <Button variant="success" className="mr-2" onClick={() => this.saveRider()}>
                                            Lagre Endringer
                                        </Button>
                                        <Button
                                            variant={'secondary'}
                                            onClick={() => {
                                                if (window.confirm("Er du sikker på at du vil angre? \nEventuelle endringer vil ikke bli lagret.")) {
                                                    this.returnToEvent()
                                                }
                                            }}>Avbryt</Button>
                                    </div>
                                </Form.Group>
                            </Form>
                        </Card>
                    </Container>
                </div>
            );
        } else {
            //only if the organizer has confirmed/denied items the artist wont get the chance to edit the rider anymore.
            //they will get a list of the items showing what they can expect when they come backstage
            return this.renderConfirmed();
        }
    }

    renderForOrganizer() {
        if (this.state.oldItems.length === 0) {
            //No oldItems means the artist hasnt added anything to their rider
            return (
                <div>
                    <Container>
                        <Card className={"m-4"}>
                            <h1 className="font-weight-bold text-center mt-4">{this.state.artist.username + ' har ikke lastet opp en rider enda'}</h1>
                            <div className="text-center">
                                <Button variant={'primary'}
                                        className={"m-4"}
                                        onClick={() => this.returnToEvent()}>
                                    Tilbake til arrangement</Button>
                            </div>
                        </Card>
                    </Container>
                </div>
            )
        } else if (!this.state.isConfirmed) {
            //renders if a organizer has not confirmed the items
            return (
                <div>
                    <Container>
                        <Card className="p-5">
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
                            <Form.Group>
                                <div className="text-center">
                                    <Button variant="success" onClick={() => this.saveConfirmedItems()}>Lagre</Button>
                                    <Button
                                        variant={'secondary'}
                                        onClick={() => {
                                            if (window.confirm("Er du sikker på at du vil angre? \nEventuelle endringer vil ikke bli lagret.")) {
                                                this.returnToEvent()
                                            }
                                        }}>Avbryt</Button>
                                </div>
                            </Form.Group>
                        </Card>
                    </Container>
                </div>
            )
        } else {
            //if organizer has confirmed the items the page will render a list with accepted and declined items
            return this.renderConfirmed();
        }
    }

    renderConfirmed() {
        return (
            <div>
                <Container>
                    <Card className="p-5">
                        <h1 className="font-weight-bold text-center">{'Rider for ' + this.state.artist.username}</h1>
                        <Form.Group>
                            <ListGroup>
                                <React.Fragment>

                                    {this.state.oldItems.filter(item => item.confirmed).map(item =>
                                        <ListGroupItem>
                                            <Row>
                                                <Col sm={2}><h6 className="text-success">
                                                    Godkjent</h6></Col>
                                                <Col>{item.item}</Col>
                                            </Row>
                                        </ListGroupItem>
                                    )}

                                </React.Fragment>
                                <React.Fragment>

                                    {this.state.oldItems.filter(item => !item.confirmed).map(item =>
                                        <ListGroupItem>
                                            <Row>
                                                <Col sm={2}><h6 className="text-danger">
                                                    Avslått</h6>
                                                </Col>
                                                <Col>{item.item}</Col>
                                            </Row>
                                        </ListGroupItem>
                                    )}

                                </React.Fragment>
                            </ListGroup>
                            <Form.Group>
                                <div className="text-center mt-3">
                                    <Button variant={'primary'}
                                            onClick={() => this.returnToEvent()}>
                                        Tilbake til arrangement</Button>
                                </div>
                            </Form.Group>
                        </Form.Group>
                    </Card>
                </Container>
            </div>
        );
    }
}