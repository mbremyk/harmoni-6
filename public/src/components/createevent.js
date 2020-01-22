import {Gig, Event, Personnel, service, SimpleFile, Artist, User,Ticket} from "../services";
import {Component} from "react-simplified";
import {HarmoniNavbar} from "./navbar";
import useReactRouter from 'use-react-router';
import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import {authService} from "../AuthService";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import moment from "moment";
import {dateInput, inputField, textField, timeInput, CustomMenu, toBase64} from "./editandcreatefunctions";

const jwt = require("jsonwebtoken");

export default function AddEvent() {

    const {history} = useReactRouter();
        this.state = {
            maxTime: moment('23:59', 'HH:mm').format('HH:mm'),
            minTime: moment('00:00', 'HH:mm').format('HH:mm'),
            ticketType: '',
            ticketPrice: 0,
            ticketAmount: 0,
            tickets: [],
            error: '',
            errorType: 'success',
        };
    }

    const [eventId, setEventId] = useState(0);
    const [organizerId, setOrganizerId] = useState(0);
    const [eventName, setEventName] = useState("");
    const [eventAddress, setEventAddress] = useState("");
    const [city, setCity] = useState("");
    const [placeDescription, setPlaceDescription] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [ageLimit, setAgeLimit] = useState(0);
    const [fDate, setFDate] = useState(require('moment')().format('YYYY-MM-DD'));
    const [tDate, setTDate] = useState(require('moment')().format('YYYY-MM-DD'));
    const [fTime, setFTime] = useState(require('moment')().format('HH:mm'));
    const [tTime, setTTime] = useState(require('moment')().format('HH:mm'));
    const [contract, setContract] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [artistsAdd, setArtistsAdd] = useState([]);
    const [users, setUsers] = useState([]);
    const [personnelAdd, setPersonnelAdd] = useState([]);
    const [personnelRole, setPersonnelRole] = useState("");
    const [cancelled, setCancelled] = useState("");
    const [addArtistByMail, setAddArtistByMail] = useState([]);
    const [artistEmail, setArtistEmail] = useState("");


    useEffect(() => {
        let token = authService.getToken();
        let decoded = jwt.decode(token);
        let uId = decoded.userId;
        setOrganizerId(uId);
        service.getUsers().then(users => setUsers(users)).catch((err) => console.log(err.message));
    }, []);


    async function sendGigs(eventId) {

        return new Promise((resolve, reject) => {

            if ((Array.isArray(artistsAdd) && artistsAdd.length)) {
                Promise.all(artistsAdd.map(artist => {
                    toBase64(artist.contract).then(contractData => {
                        let contract = new SimpleFile(contractData, artist.contract.name);
                        service
                            .addGig(new Gig(eventId, artist.userId, contract))
                            .catch(error => reject(error))
                    })
                })).then(() => resolve(true));
            } else {
                resolve(true);
            }
        });
    }

    async function sendGigs2(eventId) {

        return new Promise((resolve, reject) => {

            if ((Array.isArray(addArtistByMail) && addArtistByMail.length)) {

                Promise.all(addArtistByMail.map(artist => {

                    let u = new User();
                    u.email = artist.email;
                    u.password = "";
                    u.username = "";

                    service.createTempUser(u).then(createdUser => {

                    toBase64(artist.contract).then(contractData => {
                        let contract = new SimpleFile(contractData, artist.contract.name);
                        service
                            .addGig(new Gig(eventId, createdUser.userId, contract))
                            .catch(error => reject(error))
                    })
                    })
                })).then(() => resolve(true));
            } else {
                resolve(true);
            }
        });
    }

    async function sendPersonnel(eventId) {
        return new Promise((resolve, reject) => {
            if ((Array.isArray(personnelAdd) && personnelAdd.length)) {
                let temp = personnelAdd.map(user => new Personnel(user.userId, eventId, user.role));
            service
                .addPersonnel(temp)
                .then(() => resolve(true))
                .catch(error => reject(error));
        } else {
            resolve(true);
        }
        });
    }
    });

    sendTickets = (eventId) => new Promise((resolve, reject) => {
        if ((Array.isArray(this.state.tickets) && this.state.tickets.length)) {
            this.state.tickets = this.state.tickets.map(ticket => new Ticket(eventId, ticket.type, ticket.price, ticket.amount));
            service
                .addTickets(this.state.tickets)
                .then(() => resolve(true))
                .catch(error => reject(error));
        }else{
            resolve(true);
        }
    });

    function handleSubmit() {

        let errmsg = "";
        // check empty fields
        if (!this.state.eventName || !this.state.eventAddress || !this.state.eventDescription) {
            errmsg += 'Følgende mangler:';
            if (!this.state.eventName) errmsg += " [ Arrangementsnavn ] ";
            if (!this.state.eventAddress) errmsg += "  [ Addresse ] ";
            if (!this.state.eventDescription) errmsg += "  [ Beskrivelse ] ";
            if (!this.state.city) errmsg += "  [ By ] ";
            this.setError(errmsg, 'danger');
            return;
        }

        let fDateTime = this.state.fDate + " " + this.state.fTime + ":00";
        let tDateTime = this.state.tDate + " " + this.state.tTime + ":00";

        toBase64(image).then(i => {

            let newEvent = new Event(
                null,
                organizerId,
                eventName,
                city,
                eventAddress,
                placeDescription,
                eventDescription,
                ageLimit,
                fDateTime,
                tDateTime,
                (i ? image : imageUrl),
                cancelled);

            service.createEvent(newEvent).then(created => {
                sendGigs(created.insertId).then(() => {
                    sendGigs2(created.insertId).then(() => {
                        sendPersonnel(created.insertId).then(() => {
                            this.sendTickets(created.insertId).then(() => {
                            history.push("/arrangement/" + created.insertId)
                        })
                    })
                });
            }).catch(err => console.error(err))
        });
    }

        return (
            <div>
                <HarmoniNavbar/>
                <Container>
                    <Card className={"p-5 mt-2"}>
                        <Form>
                            <Form.Row>

                                <Form.Group as={Col} sm={"12"}>
                                    <h1 className="font-weight-bold text-center">Opprett arrangement</h1>
                                </Form.Group>


                                {inputField("12", "Arragementsnavn", "Navn på arragement", eventName, setEventName)}
                                {inputField("6", "Adresse", "Adresse der arrangementet skal holdes", eventAddress, setEventAddress)}
                                {inputField("6", "By", "By der arrangementet skal holdes", city, setCity)}
                                {textField("12", "Plass beskrivelse", "For eksempel 3. etajse", placeDescription, setPlaceDescription)}
                                {textField("12", "Beskrivelse", "Her kan du skrive en beskrivelse av arrangementet", eventDescription, setEventDescription)}
                                {dateInput("3", "Fra dato", fDate, setFDate)}
                                {timeInput("3", "Fra klokkeslett", fTime, setFTime)}
                                {dateInput("3", "Til dato", tDate, setTDate)}
                                {timeInput("3", "Til klokkeslett", tTime, setTTime)}


                                <Form.Group as={Col} sm={"12"}>

                                    <Row>
                                        <Col>
                                            <Button type="button" variant={"success"}
                                                    onClick={() => {
                                                        setAddArtistByMail(addArtistByMail.concat(new Artist(null, null, null, "")))
                                                    }
                                                    }>Legg til med mail</Button>
                                        </Col>
                                    />
                                    <span className="customStyle"/>
                                </Form.Group>

                                        <Col>

                                            <Dropdown onSelect={event => {
                                                service.getUser(event).then(user => setArtistsAdd(artistsAdd.concat(
                                                    new Artist(user.userId, user.username, user.email, "")
                                                )))
                                            }}>

                                                <Dropdown.Toggle variant={"success"} id="dropdown">
                                                    Velg artist
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu style={{overflowY: 'scroll', maxHeight: "300px"}}
                                                               as={CustomMenu}>

                                                    {users.filter(user => !artistsAdd.some(e => e.userId === user.userId)).map(user => (
                                                        <Dropdown.Item eventKey={user.userId}>
                                                            {user.username}
                                                        </Dropdown.Item>
                                                    ))}

                                                </Dropdown.Menu>

                                            </Dropdown>
                                        </Col>

                                        <Col>
                                            <Dropdown onSelect={event => {
                                                service.getUser(event).then((user) => setPersonnelAdd(personnelAdd.concat(user)))
                                            }}>

                                                <Dropdown.Toggle variant={"success"} id="dropdown">
                                                    Velg personell
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu style={{overflowY: 'scroll', maxHeight: "300px"}}
                                                               as={CustomMenu}>
                                                    {users.filter(user => !personnelAdd.some(e => e.userId === user.userId)).map(user => (
                                                        <Dropdown.Item eventKey={user.userId}>
                                                            {user.username}
                                                        </Dropdown.Item>
                                                    ))}
                                                </Dropdown.Menu>

                                            </Dropdown>
                                        </Col>
                                    </Row>
                                </Form.Group>

                                <Form.Group as={Col} sm={"12"}>

                                    <Card>
                                        <Card.Title>
                                            <h2 className="text-center">Artister</h2>
                                        </Card.Title>

                                        <ListGroup title={"Valgt personell"} className={"p-3"}>
                                            {addArtistByMail.map(artist => (
                                                <ListGroup.Item>


                                                    <Row>

                                                        <Form.Group as={Col} controlId="formBasicEmail">
                                                            <Form.Control
                                                                type="email"
                                                                placeholder="Skriv inn email"
                                                                value={artist.email}
                                                                onChange={event => {
                                                                    artist.email = event.target.value;
                                                                    setArtistEmail(event.target.value)
                                                                }}/>
                                                        </Form.Group>

                                                        <Col sm={"2"}>
                                                            <label>Last opp kontrakt:</label>
                                                        </Col>

                                                        <Form.Group as={Col} sm={"6"}>
                                                            <input type="file" className="form-control"
                                                                   encType="multipart/form-data" name="file"
                                                                   onChange={event => {
                                                                       artist.contract = event.target.files[0];
                                                                       setContract(event.target.files[0]);
                                                                   }}/>
                                                        </Form.Group>

                                                        <Col>
                                                            <Button type="button" variant={"danger"}
                                                                    onClick={() => {
                                                                        let copy = [...addArtistByMail]
                                                                        copy.splice(addArtistByMail.indexOf(artist), 1)
                                                                        setAddArtistByMail(copy)
                                                                    }}
                                                            >
                                                                Fjern
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}

                                            {artistsAdd.map(artist => (
                                            <React.Fragment key={artist.userId}>
                                                <ListGroup.Item>
                                                        <Row>

                                                            <Col sm={"2"}>
                                                                <label>{artist.username}</label>
                                                            </Col>

                                                            <Col sm={"2"}>
                                                                <label>Last opp kontrakt:</label>
                                                            </Col>

                                                            <Form.Group as={Col} sm={"6"}>
                                                                <input type="file" className="form-control"
                                                                       encType="multipart/form-data" name="file"
                                                                       onChange={event => {
                                                                           artist.contract = event.target.files[0];
                                                                           setContract(event.target.files[0]);
                                                                       }}/>
                                                            </Form.Group>

                                                            <Col sm={"2"}>
                                                                <Button type="button" variant={"danger"}
                                                                        onClick={() => {
                                                                            let copy = [...artistsAdd]
                                                                            copy.splice(artistsAdd.indexOf(artist), 1)
                                                                            setArtistsAdd(copy)
                                                                        }}
                                                                >
                                                                    Fjern</Button>
                                                            </Col>

                                                        </Row>
                                                </ListGroup.Item>
                                            </React.Fragment>
                                        ))}
                                        </ListGroup>
                                    </Card>

                                </Form.Group>

                                <Form.Group as={Col} sm={"12"}>

                                    <Card>
                                        <Card.Title>
                                            <h2 className="text-center">Personell</h2>
                                        </Card.Title>

                                        <ListGroup title={"Valgt personell"} className={"p-3"}>
                                            {personnelAdd.map(personnel => (
                                            <React.Fragment key={personnel.userId}>

                                                <ListGroup.Item>

                                                    <Row>
                                                        <Col>
                                                            {personnel.username}
                                                        </Col>

                                                        <Col>
                                                            <Form.Control
                                                                placeholder="Rollen til personen . . ."
                                                                value={personnel.role}
                                                                onChange={event => {
                                                                    personnel.role = event.target.value;
                                                                    setPersonnelRole(event.target.value)
                                                                }}
                                                            />
                                                        </Col>

                                                        <Col>
                                                            <Button type="button" variant={"danger"} onClick={() => {
                                                                let copy = [...personnelAdd]
                                                                copy.splice(personnelAdd.indexOf(personnel), 1)
                                                                setPersonnelAdd(copy)
                                                            }}
                                                            >Fjern</Button>
                                                        </Col>
                                                    </Row>

                                                </ListGroup.Item>
                                            </React.Fragment>
                                        ))}
                                    </ListGroup>
                                    </Card>

                                </Form.Group>

                                <Form.Group as={Col} sm={"6"}>
                                    <Form.Label>Last opp et forsidebilde til arrangementet</Form.Label>
                                    <input type="file" className="form-control" encType="multipart/form-data"
                                           name="file"
                                           onChange={event => setImage(event.target.files[0])}/>
                                </Form.Group>

                                <Form.Group as={Col} sm={"6"}>
                                    <Form.Label>Eller legg inn en bilde-url</Form.Label>
                                    <Form.Control
                                        placeholder="Bilde-url"
                                        value={imageUrl}
                                        onChange={event => setImageUrl(event.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"6"}>

                                    <Form.Label>Aldersgrense</Form.Label>
                                    <ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups">
                                        <ButtonGroup className="mr-2" aria-label="button-group">
                                            <Button onClick={decrementAge}>-</Button>
                                            <Button onClick={IncrementAge}>+</Button>
                                        </ButtonGroup>

                                        <InputGroup>
                                            <FormControl
                                                type="input"
                                                value={ageLimit}
                                                onChange={event => setAgeLimit(event.target.value)}
                                                aria-label="btn-age"
                                                aria-describedby="btnGroupAddon"
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text id="btnGroupAddon">år</InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>

                                    </ButtonToolbar>
                                </Form.Group>

                                <Form.Group as={Col} md={{span: 3, offset: 5}}>
                                    <Button type="button" onClick={handleSubmit}>Opprett arrangementet</Button>
                                </Form.Group>

                            </Form.Row>
                        </Form>
                    </Card>
                                <Form.Row >

                                <Form.Group as={Col} sm={"3"}>

                                    <Form.Label>Billett-type</Form.Label>
                                    <Form.Control
                                        placeholder="Navn på billettype . . ."
                                        value={this.state.ticketType}
                                        onChange={this.handleTicketType}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Billettpris</Form.Label>
                                    <InputGroup>

                                        <Form.Control
                                            type="number"
                                            placeholder="Billettpris . . ."
                                            value={this.state.ticketPrice}
                                            onChange={this.handleTicketPrice}
                                        />
                                        <InputGroup.Append>
                                            <InputGroup.Text>kr</InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Antall billetter</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Antall billetter . . ."
                                        value={this.state.ticketAmount}
                                        onChange={this.handleTicketAmount}
                                    />

                                </Form.Group>

                                <Form.Group as={Col} sm={"3"}>
                                    <Button onClick={this.handleTicket}>Legg til billett-typen</Button>
                                </Form.Group>

                            </Form.Row>

                            <ListGroup>
                                {this.state.tickets.map( t =>
                                <React.Fragment>
                                    <ListGroupItem>
                                        <Row>
                                            <Col>
                                            {"Billett-type: " + t.type}
                                            </Col>
                                            <Col>
                                            {"Billettpris:  " + t.price}
                                            </Col>
                                            <Col>
                                            {"Antall billetter: " + t.amount}
                                            </Col>
                                            <Col>
                                                <Button type="button" variant={"danger"} onClick={() => {
                                                    this.state.tickets.splice(this.state.tickets.indexOf(t), 1);
                                                    this.setState({tickets: this.state.tickets});
                                                }
                                                }>Fjern</Button>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                </React.Fragment>
                                )}
                            </ListGroup>

                            {(this.state.error) ?
                                <Alert style={{
                                    height: '9em',
                                    top: '50%',
                                    left: '50%',
                                    position: 'fixed',
                                    transform: 'translate(-50%, -50%)'
                                }} variant={this.state.errorType}><Alert.Heading>Påkrevde felter må fylles
                                    inn!</Alert.Heading><p>{this.state.error}</p></Alert> :
                                <div style={{height: '3em'}}/>}

                        </Form.Row>

                        <Form.Row>
                        <Form.Group as={Col} md={{span: 3, offset: 5}}>
                            <Button  type="button" onClick={this.handleSubmit}>Opprett arrangementet</Button>
                        </Form.Group>
                        </Form.Row>

                    </Form></Card>
                </Container>
            </div>
        );

    function IncrementAge() {
        setAgeLimit(ageLimit + 1)
    }

    function decrementAge() {
        if (ageLimit > 0) {
            setAgeLimit(ageLimit - 1)
        }
    }
}
