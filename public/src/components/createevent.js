import {Artist, Event, Gig, Personnel, service, SimpleFile} from "../services";
import {Component} from "react-simplified";
import {HarmoniNavbar} from "./navbar";
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

const jwt = require("jsonwebtoken");

//TODO: Sjekke om artist er allerede lagt inn
//TODO: Legge til annet personell
//TODO: Legge til bilde

export default function AddEvent() {

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
    const [artists, setArtists] = useState([]);
    const [personnelAdd, setPersonnelAdd] = useState([]);
    const [personnelRole, setPersonnelRole] = useState("");
    const [cancelled, setCancelled] = useState("");

    useEffect(() => {
        let token = authService.getToken();
        let decoded = jwt.decode(token);
        let uId = decoded.userId;
        setOrganizerId(uId);
        service.getUsers().then(users => setArtists(users)).catch((err) => console.log(err.message));
    }, []);

    function sendGigs(eventId) {
        new Promise((resolve, reject) => {
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

    function handleSubmit() {
        let fDateTime = fDate + " " + fTime + ":00";
        let tDateTime = tDate + " " + tTime + ":00";

        toBase64(image).then(image => {

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
                (image ? image : imageUrl),
                cancelled);

            service.createEvent(newEvent).then(created => {
                sendGigs(created.insertId).then(() => {
                    sendPersonnel(created.insertId).then(() => {
                        this.props.history.push("/arrangement/" + created.insertId)
                    })
                });
            }).catch(err => console.error(err))
        });
    }

    function toBase64(file) {
        new Promise
        ((resolve, reject) => {
            if (file === "") {
                resolve(null);
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })
    }

    function sendPersonnel(eventId) {
        new Promise((resolve, reject) => {
            if ((Array.isArray(personnelAdd) && personnelAdd.length)) {
                let temp = personnelAdd.map(user => new Personnel(user.userId, eventId, user.role));
                setPersonnelAdd(temp);
                service
                    .addPersonnel(personnelAdd)
                    .then(() => resolve(true))
                    .catch(error => reject(error));
            } else {
                resolve(true);
            }
        });
    }

    function IncrementAge() {

        setAgeLimit(ageLimit + 1)
    }

    function decrementAge() {
        if (ageLimit > 0) {
            setAgeLimit(ageLimit - 1)
        }
    }


        return (
            <div>
                <HarmoniNavbar/>
                <Container>
                    <Card className={"p-5"}>
                        <Form>
                            <Form.Row>

                                <Form.Group as={Col} sm={"12"}>
                                    <h1 className="font-weight-bold text-center">Opprett arrangement</h1>
                                </Form.Group>

                                <Form.Group as={Col} sm={"12"}>
                                    <Form.Label>Arrangementsnavn</Form.Label>
                                    <Form.Control
                                        placeholder="Navn på arrangement"
                                        value={eventName}
                                        onChange={event => setEventName(event.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"6"}>
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control
                                        placeholder="Adresse der arrangementet skal holdes"
                                        value={eventAddress}
                                        onChange={event => setEventAddress(event.target.value)}

                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"6"}>
                                    <Form.Label>By</Form.Label>
                                    <Form.Control
                                        placeholder="By der arrangementet skal holdes"
                                        value={city}
                                        onChange={event => setCity(event.target.value)}

                                    />
                                </Form.Group>


                                <Form.Group as={Col} sm={12}>
                                    <Form.Label>Plass beskrivelse</Form.Label>
                                    <Form.Control
                                        placeholder="For eksempel 3. etajse"
                                        as="textarea"
                                        rows="8"
                                        value={placeDescription}
                                        onChange={event => setPlaceDescription(event.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={12}>
                                    <Form.Label>Beskrivelse</Form.Label>
                                    <Form.Control
                                        placeholder="Her kan du skrive en beskrivelse av arrangementet"
                                        as="textarea"
                                        rows="8"
                                        value={eventDescription}
                                        onChange={event => setEventDescription(event.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Fra dato</Form.Label>
                                    <Form.Control
                                        value={fDate}
                                        onChange={event => setFDate(event.target.value)}
                                        type={"date"}

                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Fra klokkeslett</Form.Label>
                                    <Form.Control
                                        value={fTime}
                                        onChange={event => setFTime(event.target.value)}
                                        type={"time"}

                                    />
                                </Form.Group>


                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Til dato</Form.Label>
                                    <Form.Control
                                        value={tDate}
                                        onChange={event => setTDate(event.target.value)}
                                        type={"date"}

                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Til klokkeslett</Form.Label>
                                    <Form.Control
                                        value={tTime}
                                        onChange={event => setTTime(event.target.value)}
                                        type={"time"}

                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"2"}>

                                    <Form.Label>Artist</Form.Label>

                                    <Dropdown onSelect={event => service.getUser(event).then((user) => {
                                        setArtistsAdd(artistsAdd.concat(new Artist(user.userId, user.username, user.name, "")))
                                    })}>

                                        <Dropdown.Toggle variant={"success"} id="dropdown">
                                            Velg artist
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu style={{overflowY: 'scroll', maxHeight: "300px"}}
                                                       as={CustomMenu}>
                                            {artists.map(artist => (
                                                <Dropdown.Item eventKey={artist.userId}>
                                                    {artist.username}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>

                                    </Dropdown>

                                </Form.Group>

                                <Form.Group as={Col} sm={"10"}>

                                    <ListGroup title={"Valgte artister"}>
                                        {artistsAdd.map(artist => (
                                            <React.Fragment key={artist.userId}>
                                                <Card>
                                                    <Card.Title
                                                        className="font-weight-bold text-center">{artist.username}</Card.Title>
                                                    <ListGroupItem>
                                                        <Row>

                                                            <Form.Group as={Col} sm={"5"}>
                                                                <label>Last opp kontrakt</label>
                                                                <input type="file" className="form-control"
                                                                       encType="multipart/form-data" name="file"
                                                                       onChange={event => {
                                                                           artist.contract = event.target.files[0];
                                                                           setContract(event.target.files[0]);
                                                                       }}/>
                                                            </Form.Group>

                                                            <Col>
                                                            </Col>

                                                            <Col sm={"2"}>
                                                                <label>Fjern artist</label>
                                                                <Button type="button" variant={"danger"}
                                                                        onClick={() => {
                                                                            let copy = [...artistsAdd];
                                                                            copy.splice(artistsAdd.indexOf(artist), 1);
                                                                            setArtistsAdd(copy);
                                                                        }
                                                                        }>Fjern</Button>
                                                            </Col>

                                                        </Row>
                                                    </ListGroupItem>
                                                </Card>
                                            </React.Fragment>
                                        ))}
                                    </ListGroup>

                                </Form.Group>

                                <Form.Group as={Col} sm={"2"}>

                                    <Form.Label>Personell</Form.Label>

                                    <Dropdown onSelect={event => {
                                        service.getUser(event).then((user) => setPersonnelAdd(personnelAdd.concat(user)));
                                    }}>

                                        <Dropdown.Toggle variant={"success"} id="dropdown">
                                            Velg personell
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu style={{overflowY: 'scroll', maxHeight: "300px"}}
                                                       as={CustomMenu}>
                                            {artists.map(artist => (
                                                <Dropdown.Item eventKey={artist.userId}>
                                                    {artist.username}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>

                                    </Dropdown>

                                </Form.Group>

                                <Form.Group as={Col} sm={"10"}>

                                    <ListGroup title={"Valgt personell"}>
                                        {personnelAdd.map(personnel => (
                                            <React.Fragment key={personnel.userId}>
                                                <ListGroupItem>
                                                    <Row>
                                                        <Col>
                                                            {personnel.username}
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
                                                                let copy = [...personnelAdd];
                                                                copy.splice(personnelAdd.indexOf(personnel), 1);
                                                                setPersonnelAdd(copy);
                                                            }
                                                            }>Fjern</Button>
                                                        </Col>
                                                    </Row>
                                                </ListGroupItem>
                                            </React.Fragment>
                                        ))}
                                    </ListGroup>
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
                </Container>
            </div>
        );
}

const CustomMenu = React.forwardRef(
    ({children, style, className, 'aria-labelledby': labeledBy}, ref) => {
        const [value, setValue] = React.useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={e => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(children).filter(
                        child =>
                            !value || child.props.children.toLowerCase().startsWith(value),
                    )}
                </ul>
            </div>
        );
    },
);
