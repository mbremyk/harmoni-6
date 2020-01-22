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
import {CustomMenu, dateInput, inputField, textField, timeInput} from "./editandcreatefunctions";

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
    const [gigsOld, setGigsOld] = useState([]);
    const [gigsNew, setGigsNew] = useState([]);
    const [gigsNewByEmail, setGigsNewByMail] = useState([]);
    const [gigsRemove, setGigsRemove] = useState([]);

    //Personnel
    const [personnel, setPersonnel] = useState([]);
    const [personnelAdd, setPersonnelAdd] = useState([]);
    const [personnelUpdate, setPersonnelUpdate] = useState([]);
    const [personnelRemove, setPersonnelRemove] = useState([]);

    //Tickets
    const [ticketType, setTicketType] = useState('');
    const [ticketPrice, setTicketPrice] = useState(0);
    const [ticketAmount, setTicketAmount] = useState(0);
    const [tickets, setTickets] = useState([]);
    const [updatedTickets, setUpdatedTickets] = useState([]);
    const [addedTickets, setAddedTickets] = useState([]);
    const [deletedTickets, setDeletedTickets] = useState([]);

    useEffect(() => {
        service.getEventByEventId(match.params.id).then(event => {

            setEventId(event.eventId);
            setOrganizerId(event.organizerId);
            setEventName(event.eventName);
            setCity(event.city);
            setEventAddress(event.address);
            setPlaceDescription(event.placeDescription);
            setEventDescription(event.description);
            setFDate(event.startTime.split(" ")[0]);
            setFTime(event.startTime.split(" ")[1]);
            setTDate(event.endTime.split(" ")[0]);
            setTTime(event.endTime.split(" ")[1]);
            setImageUrl(event.imageUrl);
            setAgeLimit(event.ageLimit);
            setCancelled(event.cancelled);

            service.getUsers().then(users => setUsers(users)).catch((err) => console.error(err));
            service.getPersonnel(event.eventId).then(p => handlePersonnelFromDatabase(p)).catch((err) => console.error(err));
            service.getTicketToEvent(event.eventId).then(t => handleTicketsFromDB(t)).catch(err => console.error(err));
            service.getGigs(event.eventId).then(g => handleGigsFromDatabase(g)).catch((err) => console.log(err));

        }).catch(err => console.error(err));
    }, []);


    function handleSubmit() {

        if (!eventName.trim() || !eventAddress.trim() || !eventDescription.trim() || !city.trim()) {
            let errmsg = 'Følgende felter mangler:';
            if (!eventName.trim()) errmsg += " [ Arrangementsavn ] ";
            if (!eventAddress.trim()) errmsg += "  [ Addresse ] ";
            if (!eventDescription.trim()) errmsg += "  [ Beskrivelse ] ";
            if (!city.trim()) errmsg += "  [ By ] ";
            if (gigsNew.some(gig => gig.contract === null)) errmsg += "  [ Kontrakt for en Artist ] ";
            handleSetError(errmsg, 'danger');
            return;
        }

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

        service.updateEvent(ev).then(() => {
            updateTickets().then(() => {
                updateGigs().then(() => {
                    updatePersonnel().then(() => {
                        history.push("/arrangement/" + eventId)
                    })
                })
            })
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
                            <Row>

                                {inputField("12", "Arragementsnavn", "Navn på arragement", eventName, setEventName)}
                                {inputField("4", "By", "By der arrangementet skal holdes", city, setCity)}
                                {inputField("8", "Adresse", "Adresse der arrangementet skal holdes", eventAddress, setEventAddress)}
                                {textField("12", "Informasjon om stedet", "For eksempel 3. etajse", placeDescription, setPlaceDescription)}
                                {textField("12", "Beskrivelse av arrangement", "...", eventDescription, setEventDescription)}
                                {dateInput("4", "Fra:  dd/mm/yyyy", fDate, setFDate)}
                                {timeInput("2", "HH:mm", fTime, setFTime)}
                                {dateInput("4", "Til:  dd/mm/yyyy", tDate, setTDate)}
                                {timeInput("2", "HH:mm", tTime, setTTime)}

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
                                Forsidebilde:
                            </Row>

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
                                                {users.filter(user => {
                                                    if (gigsOld.some(a => a.artistId === user.userId)) return true;
                                                    return !gigsOld.some(a => a.artistId === user.userId);
                                                }).map(user => (
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
                        <Row>
                            <Form.Row>
                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Billett-type</Form.Label>
                                    <Form.Control
                                        placeholder="Navn på billettype . . ."
                                        onChange={event => setTicketType(event.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Billettpris</Form.Label>
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
                                    <Form.Label>Antall billetter</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Antall billetter . . ."
                                        onChange={event => setTicketAmount(event.target.value)}
                                    />

                                </Form.Group>

                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label> </Form.Label>
                                    <Button onClick={handleTicketsAdd}>Legg til billett-typen</Button>
                                </Form.Group>

                            </Form.Row>
                            <ListGroup title={"Billett-typer på dette arrangementet"}>
                                {tickets.map(ticket =>
                                    <React.Fragment>
                                        <ListGroupItem>
                                            <Row>
                                                <Col>
                                                    <Form.Label>Billett-type</Form.Label>
                                                    <Form.Control
                                                        placeholder="Billett-type"
                                                        value={ticket.type}
                                                        onChange={event => handleTicketsTypeChange(event, ticket)}  // denne bør endre ticket type i gjeldende objekt
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Label>Billett-pris</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Billett-pris"
                                                        value={ticket.price}
                                                        onChange={event => handleTicketsPriceChange(event, ticket)} // denne bør endre ticket price i gjeldende objekt
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Label>Antall billetter</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Antall billetter"
                                                        value={ticket.amount}
                                                        onChange={event => handleTicketsAmountChange(event, ticket)} //denne bør endre ticket amount i gjeldende objekt
                                                    />
                                                </Col>
                                                <Col>
                                                    <Button type="button" variant={"danger"}
                                                            onClick={event => handleTicketsRemoval(event, ticket)}>X</Button>
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    </React.Fragment>
                                )}
                            </ListGroup>
                            <Row>
                                <Col>
                                    <Button type="button" variant={"success"} onClick={handleSubmit}>Lagre</Button>
                                </Col>
                                <Col>
                                    <Button variant={"danger"} type="button" onClick={handleEventCancel}>Avlys
                                        arrangement</Button>
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
                                    <Button variant={"danger"} onClick={handleDelete}>Slett</Button>
                                </Col>
                            </Row>
                        </Row>
                    </Form>
                </Card>
            </Container>
        </div>
    );

    function handleMaxMinTime() {
        if (fDate === tDate) {
            setMaxTime(tTime);
            setMinTime(fTime);
        } else {
            setMaxTime(moment('23:59', 'HH:mm').format('HH:mm'));
            setMinTime(moment('00:00', 'HH:mm').format('HH:mm'));
        }
    }

    function handleDelete() {
        if (window.confirm("Er du sikker på at du vil slette arrangementet? \nDette kan ikke angres")) {
            service.deleteEvent(eventId).then(() => {
                history.push("/hjem");
                alert("Arrangementet er nå slettet")
            });
        }
    }

    function handleImageUpload(image) {
        service.toBase64(image).then((data) => setImageUrl(data));
    }

    function handleEventCancel() {
        if (window.confirm("Ønsker du å avlyse arrangementet?") === true) {
            setCancelled(true);
        }
    }

    /*
    RENDER
     */

    function renderImagePreview() {
        if (!imageUrl || imageUrl === '') return null;
        return (
            <div className="imgPreviewFrame">
                <span className="imgPreviewContainer"/><img src={imageUrl} height={'100%'} width={'100%'}
                                                            alt={'Failed to load image'}/>
            </div>
        )
    }


    /*
     Gigs/Artists
     */

    function renderArtists() {
        if ((gigsOld.length + gigsNew.length) === 0) return null;
        return (
            <Form.Group as={Col} sm={"12"}>
                <Card>
                    <Card.Title>
                        <h2 className="text-center">{(gigsOld.length + gigsNew.length + gigsNewByEmail.length) > 1 ? 'Artister' : 'Artist'}</h2>
                    </Card.Title>
                    <ListGroup title={"Valgte Artister"} className={"p-3"}>
                        {renderArtistsNewByEmail()}
                        {renderArtistsNew()}
                        {renderArtistsOld()}
                    </ListGroup>
                </Card>
            </Form.Group>
        )
    }

    function renderArtistsOld() {
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

    function renderArtistsNew() {
        return (<>
            {gigsOld.map(gig => (
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
                                <Button type="button" variant={"danger"}
                                        onClick={() => handleGigRemoval(gig)}>X</Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                </React.Fragment>
            ))}
        </>)
    }

    function renderArtistsNewByEmail() {
        return (
            <>
                {gigsNewByEmail.map(artist => (
                    <ListGroup.Item>
                        <Row>
                            <Form.Group as={Col} controlId="formBasicEmail">
                                <Form.Control
                                    type="email"
                                    placeholder="Epost til artist"
                                    value={artist.user.email}
                                    onChange={event => {
                                        artist.user.email = event.target.value;
                                        setGigsNewByMail(gigsNewByEmail)
                                    }}/>
                            </Form.Group>
                            <Col>
                                <Button type="button" variant={"danger"}
                                        onClick={() => {
                                            let copy = [...gigsNewByEmail];
                                            copy.splice(gigsNewByEmail.indexOf(artist), 1)
                                            setGigsNewByMail(copy)
                                        }}>X</Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </>)
    }

    function handleGigsFromDatabase(event_gigsFromDatabase) {
        setGigsOld([...gigsOld, ...event_gigsFromDatabase]);
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
        if (gigsOld.indexOf(gig) >= 0) {
            let copy = [...gigsOld];
            copy.splice(gigsOld.indexOf(gig), 1);
            setGigsOld(copy);
            setGigsRemove([...gigsRemove, gig]);
        } else {
            let copy = [...gigsNew];
            copy.splice(gigsNew.indexOf(gig), 1);
            setGigsNew(copy);
        }
    }

    async function updateGigs() {
        return new Promise((resolve, reject) => {
            let promises = [];
            if (Array.isArray(gigsRemove) && gigsRemove.length > 0) {
                console.log('remove GIGs', gigsRemove);
                promises.push(gigsRemove.map(gig => service.deleteGig(gig).catch(error => reject(error))));
            }
            if (Array.isArray(gigsNew) && gigsNew.length > 0) {
                console.log('add GIGs', gigsNew);
                promises.push(gigsNew.map(gig => service.addGig(gig).catch(error => reject(error))));
            }
            // if (Array.isArray(gigsNewByEmail) && gigsNewByEmail.length > 0) {
            //     console.log('add GIGs by Mail', gigsNewByEmail);
            //     promises.push(gigsNewByEmail.map(gig => service.addGig(gig).catch(error => reject(error))));
            // }
            Promise.all(promises).then(() => resolve(true));
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

    function handlePersonnelFromDatabase(event_personnelFromDatabase) {
        setPersonnelUpdate([...personnelUpdate, ...event_personnelFromDatabase]);
        setPersonnel([...personnel, ...event_personnelFromDatabase]);
    }

    function handlePersonnelAdd(event_newUserId) {
        service.getUser(event_newUserId).then((user) => {
            let p = new Personnel(user.userId, eventId, '');
            p.user = user;
            setPersonnelAdd([...personnelAdd, p]);
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

        if (personnelUpdate.indexOf(p) >= 0) {
            //if personnel is in database
            personnelUpdate.splice(personnelUpdate.indexOf(p), 1);
            setPersonnelRemove([...personnelRemove, p]);
        } else {
            //if personnel isnt in database
            personnelAdd.splice(personnelAdd.indexOf(p), 1);
        }
    }

    async function updatePersonnel() {
        return new Promise((resolve, reject) => {
            let promises = [];

            //if user has chosen to remove personnel, then remove them from the database
            if (Array.isArray(personnelRemove) && personnelRemove.length > 0) {
                console.log('remove', personnelRemove);
                promises.push(personnelRemove.map(personnel => service.deletePersonnel(eventId, personnel.personnelId).catch(error => reject(error))))
            }

            //if there are any old personnel left, update their role in the database
            if (Array.isArray(personnelUpdate) && personnelUpdate.length > 0) {
                console.log('update', personnelUpdate);
                promises.push(service.updatePersonnel(personnelUpdate).catch(error => reject(error)))
            }

            //if there are new personnel added, then add them to database
            if (Array.isArray(personnelAdd) && personnelAdd.length > 0) {
                console.log('add', personnelAdd);
                promises.push(service.addPersonnel(personnelAdd).catch(error => reject(error)))
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
        if ((tickets.some(t => t.type.trim() === ticketType.trim()) && !(deletedTickets.some(t => t.type.trim() === ticketType.trim())))) {
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
        setAddedTickets([...addedTickets, newTicket]);
        setTickets([...tickets, newTicket]);
        setTicketType('');
        setTicketPrice(0);
        setTicketAmount(0);
    }

    function handleTicketsFromDB(event_ticketsFromDB) {
        let newTickets = event_ticketsFromDB.map(t => new Ticket(t.eventId, t.type, t.price, t.amount));
        setUpdatedTickets([...updatedTickets, ...newTickets]);
        setTickets([...tickets, ...newTickets]);
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
        // setTickets(tickets);

        if (addedTickets.indexOf(ticket) >= 0) {
            let copy = [...addedTickets];
            copy.splice(addedTickets.indexOf(ticket), 1);
            setAddedTickets(copy);

        }
        if (updatedTickets.indexOf(ticket) >= 0) {
            let copy = [...updatedTickets];
            copy.splice(updatedTickets.indexOf(ticket), 1);
            setUpdatedTickets(copy);
            setDeletedTickets([...deletedTickets, ticket]);
        }
    }

    async function updateTickets() {
        return new Promise((resolve, reject) => {
            let promises = [];

            //If user has chosen to remove tickets, remove them from the database
            if (Array.isArray(deletedTickets) && deletedTickets.length > 0) {
                console.log('remove', deletedTickets);
                promises.push(deletedTickets.map(ticket => service.deleteTicket(ticket).catch(error => reject(error))));
            }

            //If user has chosen to edit ticket information, update in database
            if (Array.isArray(updatedTickets) && updatedTickets.length > 0) {
                console.log('update', updatedTickets);
                promises.push(service.updateTicket(updatedTickets).catch(error => reject(error)))

            }

            //If user has chosen to add tickets, post in database
            if (Array.isArray(addedTickets) && addedTickets.length > 0) {
                console.log('add', addedTickets);
                promises.push(service.addTickets(addedTickets).catch(error => reject(error)))
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


