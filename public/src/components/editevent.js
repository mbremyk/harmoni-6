import {service, Event, Gig, Artist} from "../services";
import useReactRouter from 'use-react-router';
import {authService} from "../AuthService";
import {Component} from "react-simplified";
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
import {HarmoniNavbar} from "./navbar";
//import {Event, service} from "../services";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import {LoginForm} from "./login";
import {CustomMenu, dateInput, inputField, textField, timeInput, toBase64} from "./editandcreatefunctions";

const jwt = require("jsonwebtoken");

export default function EditEvent() {

    const {match, history} = useReactRouter();

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
        service.getEventByEventId(match.params.id).then(event => {

            let fromDateTime = event.startTime.split(" ");
            let toDateTime = event.endTime.split(" ");
            let fromDate = fromDateTime[0];
            let toDate = toDateTime[0];
            let fromTime = fromDateTime[1];
            let toTime = toDateTime[1];

            setEventId(event.eventId);
            setOrganizerId(event.organizerId);
            setEventName(event.eventName);
            setEventAddress(event.address);
            setEventDescription(event.description);
            setAgeLimit(event.ageLimit);
            setImageUrl(event.imageUrl);
            setFDate(fromDate);
            setFTime(fromTime);
            setTDate(toDate);
            setTTime(toTime);
            setCancelled(event.cancelled);
            setCity(event.city);
            setPlaceDescription(event.placeDescription)

            service.getUsers().then(users => setUsers(users)).catch((err) => console.log(err.message));
            service.getPersonnel(match.params.id).then(personnel => setPersonnelAdd(personnel)).catch((err) => console.log(err.message));
            service.getGigs(match.params.id)
                .then(g => {
                    console.log(g);
                    g.map(u => setArtistsAdd(artistsAdd.concat(u.artistId)));
                })
                .catch((err) => console.log(err.message));
        }).catch((error) => console.log(error.message));
    }, [])

    function handleSubmit() {

        let fDateTime = fDate + " " + fTime + ":00";
        let tDateTime = tDate + " " + tTime + ":00";

        toBase64(image).then(i => {

            let ev = new Event(eventId, organizerId, eventName, city, eventAddress,
                placeDescription, eventDescription, ageLimit, fDateTime, tDateTime, (i ? image : imageUrl), cancelled);
            console.log(ev)
            service.updateEvent(ev).then(history.push("/arrangement/" + eventId));
        });
    }


    return (
        <div>
            <HarmoniNavbar/>
            <Container>
                <Card className={"p-5"}>
                    <Form>
                        <Form.Row>

                            <Form.Group as={Col} sm={"12"}>
                                <h1 className="font-weight-bold text-center">Endre arrangement</h1>
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

                                    <Col>

                                        <Dropdown onSelect={event => {
                                            service.getUser(event).then(user => setArtistsAdd(artistsAdd.concat(
                                                new Artist(user.userId, user.username, user.email, "", "")
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
                                                ))})

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
                                                                artist.artistEmail = event.target.value;
                                                                setArtistEmail(event.target.value)
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
                                                        <Col>
                                                            <label>Last ned kontrakt</label>
                                                            <Button type="button" id={"contract"}
                                                                    onClick={event => downloadC(event, artist)}>Last
                                                                ned</Button>
                                                        </Col>

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
                                                            {personnel.user.username}
                                                        </Col>

                                                        <Col>
                                                            <Form.Control
                                                                placeholder="Rollen til personen"
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
                                <input type="file" className="form-control" encType="multipart/form-data" name="file"
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
                        </Form.Row>

                        <Row>

                            <Col>
                                <Button type="button" variant={"success"} onClick={handleSubmit}>Endre
                                    arragament</Button>
                            </Col>

                            <Col>
                                <Button variant={"danger"} type="button" onClick={handleEventCancel}>Avlys
                                    arrangement</Button>
                            </Col>

                            <Col>
                                <Button variant={"danger"} onClick={handleDelete}>Slett</Button>
                            </Col>

                        </Row>
                    </Form>
                </Card>
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

function downloadC(e, artist) {

        console.log(artist)

        if(e.target.id == "contract") {
            service.downloadContract(this.state.eventId, artist.userId)
                .then(response => {
                    let fileName = response.name;
                    const link = document.createElement('a');
                    link.download = response.name;
                    //let ret = response.data.replace('data:text/plain;base64,', 'data:application/octet-stream;base64,');
                    //console.log(ret);
                    link.href = response.data;
                    link.click();
                })
        }

    }

function handleDelete() {
        if (window.confirm("Er du sikker på at du vil slette arrangementet? \nDette kan ikke angres")) {
            service.deleteEvent(this.state.eventId).then(() => {
                this.props.history.push("/hjem")
                alert("Arrangementet er nå slettet")
            });
        }
}

function handleEventCancel() {
        if (window.confirm("Ønsker du å avlyse arrangementet?") === true) {
            this.setState({cancelled: true});
            console.log("Cancelled")
        } else {
            console.log("No change")
        }
}

