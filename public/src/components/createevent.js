import {Artist, Event, Gig, Personnel, service, SimpleFile, Ticket, User} from "../services";
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
import {HarmoniNavbar} from "./navbar";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import moment from "moment";
import {
    CustomMenu,
    minDateInput,
    maxDateInput,
    inputField,
    textField,
    fromTimeInput,
    toTimeInput
} from "./editandcreatefunctions";
import {authService} from '../AuthService';

const jwt = require("jsonwebtoken");

export default function EditEvent() {

    const {match, history} = useReactRouter();
    const [error, setError] = useState('');
    const [errorType, setErrorType] = useState('success');
    const [maxTime, setMaxTime] = useState(moment('23:59', 'HH:mm').format('HH:mm'));
    const [minTime, setMinTime] = useState(moment('00:00', 'HH:mm').format('HH:mm'));
    const [users, setUsers] = useState([]);

    //Event
    const [eventId, setEventId] = useState(0);
    const [organizerId, setOrganizerId] = useState(0);
    const [eventName, setEventName] = useState("");
    const [city, setCity] = useState("");
    const [eventAddress, setEventAddress] = useState("");
    const [placeDescription, setPlaceDescription] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [ageLimit, setAgeLimit] = useState(0);
    const [cancelled, setCancelled] = useState(0);
    const [fDate, setFDate] = useState(require('moment')().format('YYYY-MM-DD'));
    const [tDate, setTDate] = useState(require('moment')().format('YYYY-MM-DD'));
    const [fTime, setFTime] = useState(require('moment')().format('HH:mm'));
    const [tTime, setTTime] = useState(require('moment')().format('HH:mm'));

    //Gigs/Artsists
    const [gigsNew, setGigsNew] = useState([]);
    const [gigsNewByEmail, setGigsNewByMail] = useState([]);
    const [gigEmail, setGigEmail] = useState('');

    //Personnel
    const [personnel, setPersonnel] = useState([]);

    //Tickets
    const [ticketType, setTicketType] = useState('');
    const [ticketPrice, setTicketPrice] = useState(0);
    const [ticketAmount, setTicketAmount] = useState(0);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        let token = authService.getToken();
        let decoded = jwt.decode(token);
        let uId = decoded.userId;
        setOrganizerId(uId);
        service.getUsers().then(users => setUsers(users)).catch((err) => console.log(err.message)).catch(err => console.error(err));
    }, []);


    function handleSubmit() {

        if (!eventName.trim() || !eventAddress.trim() || !eventDescription.trim() || !city.trim() || ageLimit < 0 || ticketPrice < 0 || ticketAmount < 0) {
            let errmsg = 'Følgende felter mangler:';
            if (!eventName.trim()) errmsg += " [ Arrangementsavn ] ";
            if (!eventAddress.trim()) errmsg += "  [ Addresse ] ";
            if (!eventDescription.trim()) errmsg += "  [ Beskrivelse ] ";
            if (!city.trim()) errmsg += "  [ By ] ";
            if (gigsNew.some(gig => gig.contract === null)) errmsg += "  [ Kontrakt for en Artist ] ";
            if (ticketPrice < 0) errmsg = "Billetpris må være større enn null";
            if (ticketAmount < 0) errmsg = "Antall billetter må være større enn null";
            if (ageLimit < 0) errmsg = "Aldersgrense må være større enn null";
            handleSetError(errmsg, 'danger');
            return;
        }
        if (fDate > tDate) {
            let errmsg = "Fra-dato må være mindre enn eller lik til-dato";
            handleSetError(errmsg, 'danger');
            return;
        }
        if (fDate === tDate) {
            setMaxTime(tTime);
            setMinTime(fTime);
            if (fTime >= tTime) {
                let errmsg = "Fra-tid må være mindre enn til-tid på samme dag";
                handleSetError(errmsg, 'danger');
                return;
            }
        }
        setMaxTime(moment('23:59', 'HH:mm').format('HH:mm'));
        setMinTime(moment('00:00', 'HH:mm').format('HH:mm'));


        let fDateTime = fDate + " " + fTime + ":00";
        let tDateTime = tDate + " " + tTime + ":00";

        let ev = new Event(
            eventId,
            organizerId,
            eventName,
            city,
            eventAddress,
            placeDescription,
            eventDescription,
            ageLimit,
            fDateTime,
            tDateTime,
            imageUrl,
            cancelled
        );

        service.createEvent(ev).then((created) => {
            sendTickets(created.insertId).then(() => {
                sendGigs(created.insertId).then(() => {
                    sendPersonnel(created.insertId).then(() => {
                        history.push("/arrangement/" + created.insertId)
                    })
                })
            })
        });
    }

    return (
        <div>
            <HarmoniNavbar/>
            <Container className={"c-lg"}>
                <Card className={"p-5"}>
                    <Form>
                        <Form.Row>

                            <Form.Group as={Col} sm={"12"}>
                                <h1 className="display-sm-3">Opprett arrangement</h1>
                            </Form.Group>
                            <Row>

                                {inputField("12", "Arragementsnavn", "Navn på arragement", eventName, setEventName)}
                                {inputField("4", "By", "By der arrangementet skal holdes", city, setCity)}
                                {inputField("8", "Adresse", "Adresse der arrangementet skal holdes", eventAddress, setEventAddress)}
                                {textField("12", "Informasjon om stedet", "For eksempel 3. etajse", placeDescription, setPlaceDescription)}
                                {textField("12", "Beskrivelse av arrangement", "...", eventDescription, setEventDescription)}
                                {minDateInput("4", "Fra:  dd/mm/yyyy", fDate, require('moment')().format('HH:mm'), tDate, setFDate)}
                                {fromTimeInput("2", "HH:mm", fTime, maxTime, setFTime)}
                                {maxDateInput("4", "Til:  dd/mm/yyyy", tDate, fDate, setTDate)}
                                {toTimeInput("2", "HH:mm", tTime, minTime, setTTime)}

                                <Form.Group as={Col} sm={"12"}>
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
                                                onChange={event => setAgeLimit(event.target.value >= 0 ? event.target.value : (event.target.value * -1))}
                                                aria-label="btn-age"
                                                aria-describedby="btnGroupAddon"/>
                                            <InputGroup.Append>
                                                <InputGroup.Text id="btnGroupAddon">år</InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </ButtonToolbar>
                                </Form.Group>
                            </Row>
                            <Row>
                                <label>Forsidebilde:</label>
                                {renderImagePreview()}

                                <Form.Group as={Col} sm={"4"}>
                                    <input type="file" className="form-control" encType="multipart/form-data"
                                           name="file"
                                           onChange={event => handleImageUpload(event.target.files[0])}/>
                                </Form.Group>

                                <Form.Group as={Col} sm={"8"}>
                                    <Form.Control
                                        placeholder="Url.."
                                        value={imageUrl}
                                        onChange={event => setImageUrl(event.target.value)}
                                    />
                                </Form.Group>
                            </Row>

                            <Form.Group as={Col} sm={"12"}>
                                <Row>
                                    <Col>
                                        <Button type="button" variant={"success"}
                                                onClick={() => {
                                                    handleGigAddByEmail()
                                                }}>Legg til artist med mail</Button>
                                    </Col>
                                    <Col>
                                        <Dropdown onSelect={event => handleGigAdd(event)}>
                                            <Dropdown.Toggle variant={"success"} id="dropdown">
                                                + Artist</Dropdown.Toggle>
                                            <Dropdown.Menu style={{overflowY: 'scroll', maxHeight: "300px"}}
                                                           as={CustomMenu}>
                                                {users.filter(user => !gigsNew.some(a => a.artistId === user.userId)).map(user => (
                                                    <Dropdown.Item eventKey={user.userId}>
                                                        {user.username}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Col>
                                    <Col>
                                        <Dropdown onSelect={event => handlePersonnelAdd(event)}>
                                            <Dropdown.Toggle variant={"success"} id="dropdown">
                                                + Personell</Dropdown.Toggle>
                                            <Dropdown.Menu style={{overflowY: 'scroll', maxHeight: "300px"}}
                                                           as={CustomMenu}>
                                                {users.filter(user => !personnel.some(p => p.personnelId === user.userId)).map(user => (
                                                    <Dropdown.Item eventKey={user.userId}>
                                                        {user.username}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Col>
                                </Row>
                            </Form.Group>

                            {renderArtists()}
                            {renderPersonnel()}

                        </Form.Row>

                        <Card>

                            <Card.Title>
                                <h2 className="text-center">Biletter</h2>
                            </Card.Title>

                            <ListGroup className={"p-3"}>
                                <ListGroup.Item>

                                    <Row>
                                        <Col sm={3}>
                                            <label>Bilett type</label>
                                        </Col>


                                        <Col sm={3}>
                                            <label>Bilett pris</label>
                                        </Col>


                                        <Col sm={3}>
                                            <label>Bilett mengde</label>
                                        </Col>
                                    </Row>


                                    <Form.Row>

                                        <Form.Group as={Col} sm={"3"}>
                                            <Form.Control
                                                placeholder="Navn på billettype . . ."
                                                onChange={event => setTicketType(event.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} sm={"3"}>
                                            <InputGroup>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Billettpris . . ."
                                                    onChange={event => setTicketPrice(event.target.value)}
                                                />
                                                <InputGroup.Append>
                                                    <InputGroup.Text>kr</InputGroup.Text>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group as={Col} sm={"3"}>
                                            <Form.Control
                                                type="number"
                                                placeholder="Antall billetter . . ."
                                                onChange={event => setTicketAmount(event.target.value)}
                                            />

                                        </Form.Group>

                                        <Form.Group as={Col} sm={"3"}>

                                            <Button onClick={handleTicketsAdd} variant={"success"}>Legg til
                                                bilett</Button>
                                        </Form.Group>
                                    </Form.Row>
                                </ListGroup.Item>

                                <ListGroup.Item>

                                {tickets.map(ticket =>
                                    <React.Fragment>
                                        <Row>
                                            <Col sm={3}>
                                                <Form.Control
                                                    placeholder="Billett-type"
                                                    value={ticket.type}
                                                    onChange={event => handleTicketsTypeChange(event, ticket)}  // denne bør endre ticket type i gjeldende objekt
                                                />
                                            </Col>
                                            <Col sm={3}>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Billett-pris"
                                                    value={ticket.price}
                                                    onChange={event => handleTicketsPriceChange(event, ticket)} // denne bør endre ticket price i gjeldende objekt
                                                />
                                            </Col>
                                            <Col sm={3}>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Antall billetter"
                                                    value={ticket.amount}
                                                    onChange={event => handleTicketsAmountChange(event, ticket)} //denne bør endre ticket amount i gjeldende objekt
                                                />
                                            </Col>
                                            <Col sm={3}>
                                                <Button type="button" variant={"danger"}
                                                        onClick={event => handleTicketsRemoval(event, ticket)}>X</Button>
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>


                        <Row>
                            <Col>
                                <Button type="button" variant={"success"} onClick={handleSubmit}>Lagre</Button>
                            </Col>

                            {(error) ?
                                <Alert style={{
                                    height: '9em',
                                    top: '50%',
                                    left: '50%',
                                    position: 'fixed',
                                    transform: 'translate(-50%, -50%)'
                                }} variant={errorType}><Alert.Heading>Vent nå litt!</Alert.Heading>
                                    <p>{error}</p></Alert> :
                                <div style={{height: '3em'}}/>}
                            <Col>
                                <Button variant={"danger"} onClick={handleDelete}>Avbryt</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Container>
        </div>
    )
        ;

    function handleDelete() {
        history.push('/hjem');
    }

    function handleImageUpload(image) {
        service.toBase64(image).then((data) => setImageUrl(data));
    }


    /*
    RENDER
     */

    function renderImagePreview() {
        if (!imageUrl || imageUrl === '') return null;
        return (
            <div className="imgPreviewFrame">
                <span className="imgPreviewContainer"/><img src={imageUrl} height={'100%'}
                                                            alt={'Failed to load image'}/>
            </div>
        )
    }


    /*
     Gigs/Artists
     */

    function renderArtists() {
        if ((gigsNew.length + gigsNewByEmail.length) === 0) return null;
        return (
            <Form.Group as={Col} sm={"12"}>
                <Card>
                    <Card.Title>
                        <h2 className="text-center">{(gigsNew.length + gigsNewByEmail.length) > 1 ? 'Artister' : 'Artist'}</h2>
                    </Card.Title>
                    <ListGroup title={"Valgte Artister"} className={"p-3"}>
                        {renderArtistsNewByEmail()}
                        {renderArtistsNew()}
                    </ListGroup>
                </Card>
            </Form.Group>
        )
    }

    function renderArtistsNewByEmail() {
        return (
            <>
                {gigsNewByEmail.map(gig => (
                    <ListGroup.Item>
                        <Row>
                            <Form.Group as={Col} controlId="formBasicEmail">
                                <Form.Control
                                    type="email"
                                    placeholder="Epost til artist"
                                    value={gig.user.email}
                                    onChange={event => {
                                        setGigEmail(event.target.value);
                                        gig.user.email = event.target.value;
                                    }}/>
                            </Form.Group>
                            <Form.Group as={Col} sm={"6"}>
                                <input type="file" className="form-control"
                                       encType="multipart/form-data" name="file"
                                       onChange={event => handleContractUpload(event, gig)}/>
                            </Form.Group>
                            <Col>
                                <Button type="button" variant={"danger"}
                                        onClick={() => {
                                            handleGigRemoval(gig)
                                        }}>X</Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </>)
    }

    function renderArtistsNew() {
        return (<>
            {gigsNew.map(gig => (
                <React.Fragment key={gig.user.userId}>
                    <ListGroup.Item>
                        <Row>
                            <Col sm={"2"}>
                                <label>{gig.user.username}</label>
                            </Col>
                            <Col sm={"2"}>
                                <label>{gig.user.email}</label>
                            </Col>
                            <Col sm={"2"}>
                                <label>Kontrakt:</label>
                            </Col>
                            <Form.Group as={Col} sm={"6"}>
                                <input type="file" className="form-control"
                                       encType="multipart/form-data" name="file"
                                       onChange={event => handleContractUpload(event, gig)}/>
                            </Form.Group>
                            <Col sm={"2"}>
                                <Button type="button" variant={"danger"}
                                        onClick={() => handleGigRemoval(gig)}>X</Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                </React.Fragment>
            ))}
        </>)
    }


    function handleGigAdd(event_newUserId) {
        service.getUser(event_newUserId).then((user) => {
            let gig = new Gig(eventId, user.userId, null);
            gig.user = user;
            setGigsNew([...gigsNew, gig]);
        });
    }

    function handleGigAddByEmail() {
        let gig = new Gig(eventId, null, null);
        gig.user = new User(null, '', '');
        setGigsNewByMail([...gigsNewByEmail, gig])
    }

    function handleContractUpload(event, gig) {
        let file = event.target.files[0];
        service.toBase64(file).then(contractData => {
            gig.contract = new SimpleFile(contractData, file.name);
        })
    }

    function handleGigRemoval(gig) {
        if (gigsNewByEmail.indexOf(gig) >= 0) {
            let copy = [...gigsNewByEmail];
            copy.splice(gigsNewByEmail.indexOf(gig), 1);
            setGigsNewByMail(copy)
        } else {
            let copy = [...gigsNew];
            copy.splice(gigsNew.indexOf(gig), 1);
            setGigsNew(copy);
        }
    }

    async function sendGigs(eventId) {
        return new Promise((resolve, reject) => {
            let promises = [];
            if (Array.isArray(gigsNew) && gigsNew.length > 0) {
                console.log('add GIGs', gigsNew);
                promises.push(gigsNew.map(gig => service.addGig(new Gig(eventId, gig.artistId, gig.contract)).catch(error => reject(error))));
            }
            if ((Array.isArray(gigsNewByEmail) && gigsNewByEmail.length)) {
                console.log('add GIGS by Email', gigsNewByEmail);
                promises.push(sendGigsByEmail(eventId));
            }

            Promise.all(promises).then(() => resolve(true));
        });
    }

    async function sendGigsByEmail(eventId) {

        return new Promise((resolve, reject) => {
            Promise.all(gigsNewByEmail.map(gig => {

                let u = new User();
                u.email = gig.user.email;
                u.password = "";
                u.username = "";

                service.createTempUser(u).then(createdUser => {
                    service
                        .addGig(new Gig(eventId, createdUser.userId, gig.contract))
                        .catch(error => reject(error))
                })
            })).then(() => resolve(true));
        });
    }


    /*
    Personnel
     */

    function renderPersonnel() {
        if (personnel.length < 1) return null;
        return (
            <Form.Group as={Col} sm={"12"}>
                <Card>
                    <Card.Title>
                        <h2 className="text-center">Personell</h2>
                    </Card.Title>
                    <ListGroup title={"Valgt personell"} className={"p-3"}>
                        {personnel.map(p => (
                            <React.Fragment key={p.userId}>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            {p.user.username}
                                        </Col>
                                        <Col>
                                            {p.user.email}
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                placeholder="Rollen til personen"
                                                value={p.role}
                                                onChange={event => handlePersonnelRoleChange(event, p)}/>
                                        </Col>
                                        <Col>
                                            <Button type="button" variant={"danger"}
                                                    onClick={() => handlePersonnelRemoval(p)}>X</Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </React.Fragment>
                        ))}
                    </ListGroup>
                </Card>
            </Form.Group>
        )
    }

    function handlePersonnelAdd(event_newUserId) {
        service.getUser(event_newUserId).then((user) => {
            let p = new Personnel(user.userId, eventId, '');
            p.user = user;
            setPersonnel([...personnel, p]);
        });
    }

    function handlePersonnelRoleChange(event, p) {
        p.role = event.target.value;
        setPersonnel([...personnel]);
    }

    function handlePersonnelRemoval(p) {
        let copy = [...personnel];
        copy.splice(personnel.indexOf(p), 1);
        setPersonnel(copy);
    }

    async function sendPersonnel(eventId) {
        return new Promise((resolve, reject) => {
            let promises = [];

            //if there are new personnel added, then add them to database
            if (Array.isArray(personnel) && personnel.length > 0) {
                console.log('add', personnel);
                promises.push(service.addPersonnel(personnel.map(p => new Personnel(p.personnelId, eventId, p.role))).catch(error => reject(error)))
            }

            Promise.all(promises).then(() => resolve(true)).catch(error => reject(error));
        });
    }


    /*
     Tickets
    */

    function handleSetError(message, variant) {
        setError(message);
        setErrorType(variant);
        setTimeout(() => {
            setError('');
            setErrorType('primary')
        }, 5000)
    }

    function handleTicketsAdd() {
        let errmsg = "";
        if ((tickets.some(t => t.type.trim() === ticketType.trim()))) {
            errmsg += "Denne billett-typen finnes allerede!";
            handleSetError(errmsg, 'danger');
            setTicketType('');
            return;
        } else if (!ticketType.trim()) {
            errmsg += "Vennligst skriv inn en billett-type";
            handleSetError(errmsg, 'danger');
            return;
        }
        let newTicket = new Ticket(eventId, ticketType, ticketPrice, ticketAmount);
        setTickets([...tickets, newTicket]);
        setTicketType('');
        setTicketPrice(0);
        setTicketAmount(0);
    }

    function handleTicketsTypeChange(event, ticket) {
        ticket.type = event.target.value;
        setTickets([...tickets]);
    }

    function handleTicketsPriceChange(event, ticket) {
        ticket.price = event.target.value;
        setTickets([...tickets]);
    }

    function handleTicketsAmountChange(event, ticket) {
        ticket.amount = event.target.value;
        setTickets([...tickets]);
    }

    function handleTicketsRemoval(event, ticket) {
        let copy = [...tickets];
        copy.splice(tickets.indexOf(ticket), 1);
        setTickets(copy);
    }

    async function sendTickets(eventId) {
        return new Promise((resolve, reject) => {
            let promises = [];

            //If user has chosen to add tickets, post in database
            if (Array.isArray(tickets) && tickets.length > 0) {
                console.log('add Tickets', tickets);
                promises.push(service.addTickets(tickets.map(t => new Ticket(eventId, t.type, t.price, t.amount))).catch(error => reject(error)))
            }

            Promise.all(promises).then(() => resolve(true))
        });
    }

    /*
        Other
     */

    function IncrementAge() {
        setAgeLimit(ageLimit + 1)
    }

    function decrementAge() {
        if (ageLimit > 0) {
            setAgeLimit(ageLimit - 1)
        }
    }
}


