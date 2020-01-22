import {service, Event, Gig, Artist, SimpleFile, Ticket, Personnel} from "../services";
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
import Alert from "react-bootstrap/Alert";
import moment from "moment";
import {DownloadWidget} from "../widgets";
import {CustomMenu, dateInput, inputField, textField, timeInput, toBase64} from "./editandcreatefunctions";

const jwt = require("jsonwebtoken");

export default function EditEvent() {

    const {match, history} = useReactRouter();
    this.state = {
        maxTime: moment('23:59', 'HH:mm').format('HH:mm'),
        minTime: moment('00:00', 'HH:mm').format('HH:mm'),

        gigsOld: [],
        gigsNew: [],
        gigsRemove: [],

        personnel: [], //all personnel used to render them on the page
        personnelUpdate: [], //personnel already registered
        personnelAdd: [], //personnel added
        personnelRemove: [], //personnel for removal

        ticketType: '',
        ticketPrice: 0,
        ticketAmount: 0,

        error: '',
        errorType: 'success',

        tickets: [], //tickets got on mounted
        updatedTickets: [], //tickets that are to be updated
        addedTickets: [], // tickets that are to be added
        deletedTickets: [], // tickets that are to be deleted
    };

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
    const [cancelled, setCancelled] = useState("");
    const [addArtistByMail, setAddArtistByMail] = useState([]);
    const [artistEmail, setArtistEmail] = useState("");
    const [personnel, setPersonnel] = useState([]);
    const [personnelUpdate, setPersonnelUpdate] = useState([]);
    const [personnelRemove, setPersonnelRemove] = useState([]);
    const [personnelRole, setPersonnelRole] = useState("");

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
            setPlaceDescription(event.placeDescription);

            service.getUsers().then(users => setUsers(users)).catch((err) => console.log(err.message));
            service.getPersonnel(match.params.id).then(p => {
                setPersonnelUpdate(p);
                setPersonnel(p);
            }).catch((err) => console.log(err.message));
            service.getGigs(match.params.id)
                .then(g => {
                    console.log(g);
                    setArtistsAdd(g)
                })
                .catch((err) => console.log(err.message));
        }).catch((error) => console.log(error.message));
    }, [])

    handleMaxMinTime() {
        if (this.state.fDate === this.state.tDate) {
            this.setState({maxTime: this.state.tTime});
            this.setState({minTime: this.state.fTime});
        } else {
            this.setState({minTime: moment('00:00', 'HH:mm').format('HH:mm')});
            this.setState({maxTime: moment('23:59', 'HH:mm').format('HH:mm')});
        }
    }















    /*
     Gigs
     */


    handleGigsFromDatabase(event_gigsFromDatabase) {
        this.setState({gigsOld: [...this.state.gigsOld, ...event_gigsFromDatabase]});
    }

    handleGigAdd(event_newUserId) {
        service.getUser(event_newUserId).then((user) => {
            let gig = new Gig(this.state.eventId, user.userId, null);
            gig.user = user;
            this.setState({gigsNew: [...this.state.gigsNew, gig]});
        });
    }

    handleContractUpload(event, gig) {
        let file = event.target.files[0];
        service.toBase64(file).then(contractData => {
            gig.contract = new SimpleFile(contractData, file.name);
        })
    }

    handleGigRemoval(gig) {
        if (this.state.gigsOld.indexOf(gig) >= 0) {
            this.state.gigsOld.splice(this.state.gigsOld.indexOf(gig), 1);
            this.setState({gigsRemove: [...this.state.gigsRemove, gig]});
        } else {
            this.state.gigsNew.splice(this.state.gigsNew.indexOf(gig), 1);
        }
    }

    updateGigs = () => new Promise((resolve, reject) => {
        let promises = [];

        if (Array.isArray(this.state.gigsRemove) && this.state.gigsRemove.length > 0) {
            console.log('remove GIGs', this.state.gigsRemove);
            promises.push(this.state.gigsRemove.map(gig => service.deleteGig(gig).catch(error => reject(error))));
        }

        if (Array.isArray(this.state.gigsNew) && this.state.gigsNew.length > 0) {
            console.log('add GIGs', this.state.gigsNew);
            promises.push(this.state.gigsNew.map(gig => service.addGig(gig).catch(error => reject(error))));
        }

        Promise.all(promises).then(() => resolve(true));
    });



    /*
    Personnel
     */


    handlePersonnelFromDatabase(event_personnelFromDatabase) {
        this.setState({personnelUpdate: [...this.state.personnelUpdate, ...event_personnelFromDatabase]});
        this.setState({personnel: [...this.state.personnel, ...event_personnelFromDatabase]});
    }

    handlePersonnelAdd(event_newUserId) {
        service.getUser(event_newUserId).then((user) => {
            let personnel = new Personnel(user.userId, this.state.eventId, '');
            personnel.user = user;
            this.setState({personnelAdd: [...this.state.personnelAdd, personnel]});
            this.setState({personnel: [...this.state.personnel, personnel]});
        });
    }

    handlePersonnelRoleChange(change, personnel) {
        personnel.role = change.target.value;
        this.setState({personnel: [...this.state.personnel]});
    }

    handlePersonnelRemoval(personnel) {
        this.state.personnel.splice(this.state.personnel.indexOf(personnel), 1);
        this.setState({personnel: [...this.state.personnel]});

        if (this.state.personnelUpdate.indexOf(personnel) >= 0) {
            //if personnel is in database
            this.state.personnelUpdate.splice(this.state.personnelUpdate.indexOf(personnel), 1);
            this.setState({personnelRemove: [...this.state.personnelRemove, personnel]});
        } else {
            //if personnel is'nt in database
            this.state.personnelAdd.splice(this.state.personnelAdd.indexOf(personnel), 1);
        }
    }

    updatePersonnel = () => new Promise((resolve, reject) => {
        let promises = [];

        //if user has chosen to remove personnel, then remove them from the database
        if (Array.isArray(this.state.personnelRemove) && this.state.personnelRemove.length > 0) {
            console.log('remove Personnel', this.state.personnelRemove);
            promises.push(this.state.personnelRemove.map(personnel => service.deletePersonnel(this.state.eventId, personnel.personnelId).catch(error => reject(error))))
        }

        //if there are any old personnel left, update their role in the database
        if (Array.isArray(this.state.personnelUpdate) && this.state.personnelUpdate.length > 0) {
            console.log('update Personnel', this.state.personnelUpdate);
            promises.push(service.updatePersonnel(this.state.personnelUpdate).catch(error => reject(error)))
        }

        //if there are new personnel added, then add them to database
        if (Array.isArray(this.state.personnelAdd) && this.state.personnelAdd.length > 0) {
            console.log('add Personnel', this.state.personnelAdd);
            promises.push(service.addPersonnel(this.state.personnelAdd).catch(error => reject(error)))
        }

        Promise.all(promises).then(() => resolve(true)).catch(error => reject(error));
    });


    /*
     Ticket
    */

    handleTicketType(event) {
        this.setState({ticketType: event.target.value})
    }

    handleTicketPrice(event) {
        this.setState({ticketPrice: event.target.value})
    }

    handleTicketAmount(event) {
        this.setState({ticketAmount: event.target.value})
    }

    handleTicketsAdd() {


        let errmsg = "";
        if ((this.state.tickets.some(t => t.type.trim() === this.state.ticketType.trim()) && !(this.state.deletedTickets.some(t => t.type.trim() === this.state.ticketType.trim())))) {
            errmsg += "Denne billett-typen finnes allerede!";
            this.setError(errmsg, 'danger');
            this.setState({ticketType: ""});
            this.setState({ticketPrice: 0});
            this.setState({ticketAmount: 0});
            return;
        } else if (!this.state.ticketType.trim()) {
            errmsg += "Vennligst skriv inn en billett-type";
            this.setError(errmsg, 'danger');
            return;
        }
        let newTicket = new Ticket(this.state.eventId, this.state.ticketType, this.state.ticketPrice, this.state.ticketAmount)
        this.setState({addedTickets: [...this.state.addedTickets, newTicket]});
        this.setState({tickets: [...this.state.tickets, newTicket]});
    }

    handleTicketsFromDB(event_ticketsFromDB) {
        let newTickets = event_ticketsFromDB.map(t => new Ticket(t.eventId, t.type, t.price, t.amount));
        this.setState({updatedTickets: [...this.state.updatedTickets, ...newTickets]});
        this.setState({tickets: [...this.state.tickets, ...newTickets]});
    }

    handleTicketsTypeChange(event, ticket) {
        ticket.type = event.target.value;
        this.setState({tickets: [...this.state.tickets]});
    }

    handleTicketsPriceChange(event, ticket) {
        ticket.price = event.target.value;
        this.setState({tickets: [...this.state.tickets]});
    }

    handleTicketsAmountChange(event, ticket) {
        ticket.amount = event.target.value;
        this.setState({tickets: [...this.state.tickets]});
    }

    handleTicketsRemoval(event, ticket) {
        this.state.tickets.splice(this.state.tickets.indexOf(ticket), 1);
        this.setState({tickets: [...this.state.tickets]});

        if (this.state.addedTickets.indexOf(ticket) >= 0) {
            this.state.addedTickets.splice(this.state.tickets.indexOf(ticket), 1);

        }
        if (this.state.updatedTickets.indexOf(ticket) >= 0) {
            this.state.updatedTickets.splice(this.state.tickets.indexOf(ticket), 1);
            this.setState({deletedTickets: [...this.state.deletedTickets, ticket]});

        }
    }

    updateTickets = () => new Promise((resolve, reject) => {
        let promises = [];

        //If user has chosen to remove tickets, remove them from the database
        if (Array.isArray(this.state.deletedTickets) && this.state.deletedTickets.length > 0) {
            console.log('remove', this.state.deletedTickets);
            promises.push(this.state.deletedTickets.map(ticket => service.deleteTicket(ticket).catch(error => {
                reject(error);
                console.log(error);
            })))
        }

        //If user has chosen to edit ticket information, update in database
        if (Array.isArray(this.state.updatedTickets) && this.state.updatedTickets.length > 0) {
            console.log('update', this.state.updatedTickets);
            promises.push(service.updateTicket(this.state.updatedTickets).catch(error => {
                reject(error);
                console.log(error);
            }))
        }

        //If user has chosen to add tickets, post in database
        if (Array.isArray(this.state.addedTickets) && this.state.addedTickets.length > 0) {
            console.log('add', this.state.addedTickets);
            promises.push(service.addTickets(this.state.addedTickets).catch(error => {
                reject(error);
                console.log(error);
            }))
        }

        Promise.all(promises).then(() => resolve(true)).catch(error => {
            reject(error);
            console.log(error);
        });
    });

    setError(message, variant) {
        this.setState({error: message, errorType: variant});
        setTimeout(() => this.setState({error: '', errorType: 'primary'}), 5000);
    }























    function handleSubmit() {

        let fDateTime = fDate + " " + fTime + ":00";
        let tDateTime = tDate + " " + tTime + ":00";

        toBase64(image).then(i => {

            let ev = new Event(eventId, organizerId, eventName, city, eventAddress,
                placeDescription, eventDescription, ageLimit, fDateTime, tDateTime, (i ? image : imageUrl), cancelled);
            console.log(ev)
            service.updateEvent(ev).then(() => {
                updatePersonnel().then(() => {
                    addTickets
                    addGigs
                }
                    history.push("/arrangement/" + eventId)
                })
            });
        });
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
                                                ))}

                                            </Dropdown.Menu>

                                        </Dropdown>
                                    </Col>

                                    <Col>
                                        <Dropdown onSelect={event => {

                                            service.getUser(event).then((user) => {
                                                let p = new Personnel(user.userId, eventId, '');
                                                p.user = user;
                                                setPersonnelAdd([...personnelAdd, p]);
                                                setPersonnel([...personnel, p]);
                                            })


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

                                                            <Col sm={""}>
                                                                <DownloadWidget artist={artist.userId}
                                                                                event={this.state.eventId}/>
                                                            </Col>
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
                                        {personnel.map(p => (
                                            <React.Fragment key={p.userId}>

                                                <ListGroup.Item>

                                                    <Row>
                                                        <Col>
                                                            {p.user.username}
                                                        </Col>

                                                        <Col>
                                                            <Form.Control
                                                                placeholder="Rollen til personen"
                                                                value={p.role}
                                                                onChange={event => {
                                                                    p.role = event.target.value;
                                                                    setPersonnelRole(event.target.value)
                                                                }}
                                                            />
                                                        </Col>

                                                        <Col>
                                                            <Button type="button" variant={"danger"} onClick={() => {
                                                                let copy = [...personnelAdd];
                                                                copy.splice(personnelAdd.indexOf(p), 1)
                                                                setPersonnelAdd(copy);

                                                                if (personnelUpdate.indexOf(p) >= 0) {
                                                                    //if personnel is in database
                                                                    personnelUpdate.splice(personnelUpdate.indexOf(p), 1);
                                                                    setPersonnelRemove([...personnelRemove, p]);
                                                                } else {
                                                                    //if personnel isnt in database
                                                                    personnelAdd.splice(personnelAdd.indexOf(p), 1);
                                                                }

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
                            <Form.Row>

                                <Form.Group as={Col} sm={"3"}>

                                    <Form.Label>Billett-type</Form.Label>
                                    <Form.Control
                                        placeholder="Navn på billettype . . ."
                                        onChange={this.handleTicketType}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Billettpris</Form.Label>
                                    <InputGroup>

                                        <Form.Control
                                            type="number"
                                            placeholder="Billettpris . . ."
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
                                        onChange={this.handleTicketAmount}
                                    />

                                </Form.Group>

                                <Form.Group as={Col} sm={"3"}>
                                    <Button onClick={this.handleTicketsAdd}>Legg til billett-typen</Button>
                                </Form.Group>

                            </Form.Row>

                            <ListGroup title={"Billett-typer på dette arrangementet"}>
                                {this.state.tickets.map(ticket =>
                                    <React.Fragment>
                                        <ListGroupItem>
                                            <Row>
                                                <Col>
                                                    <Form.Label>Billett-type</Form.Label>
                                                    <Form.Control
                                                        placeholder="Billett-type"
                                                        value={ticket.type}
                                                        onChange={event => this.handleTicketsTypeChange(event, ticket)}  // denne bør endre ticket type i gjeldende objekt
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Label>Billett-pris</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Billett-pris"
                                                        value={ticket.price}
                                                        onChange={event => this.handleTicketsPriceChange(event, ticket)} // denne bør endre ticket price i gjeldende objekt
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Label>Antall billetter</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Antall billetter"
                                                        value={ticket.amount}
                                                        onChange={event => this.handleTicketsAmountChange(event, ticket)} //denne bør endre ticket amount i gjeldende objekt
                                                    />
                                                </Col>
                                                <Col>
                                                    <Button type="button" variant={"danger"}
                                                            onClick={event => this.handleTicketsRemoval(event, ticket)}>X</Button>
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    </React.Fragment>
                                )}
                            </ListGroup>
                            <Row>

                            <Col>
                                <Button type="button" variant={"success"} onClick={handleSubmit}>Endre
                                    arragament</Button>
                            </Col>

                            <Col>
                                <Button variant={"danger"} type="button" onClick={handleEventCancel}>Avlys
                                    arrangement</Button>
                            </Col>

                                {(this.state.error) ?
                                    <Alert style={{
                                        height: '9em',
                                        top: '50%',
                                        left: '50%',
                                        position: 'fixed',
                                        transform: 'translate(-50%, -50%)'
                                    }} variant={this.state.errorType}><Alert.Heading>Vent nå litt!</Alert.Heading>
                                        <p>{this.state.error}</p></Alert> :
                                <div style={{height: '3em'}}/>}

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

    function downloadC(e, artist) {

        console.log(artist)

        if (e.target.id == "contract") {
            service.downloadContract(eventId, artist.userId)
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
            service.deleteEvent(eventId).then(() => {
                history.push("/hjem")
                alert("Arrangementet er nå slettet")
            });
        }
    }

    function handleEventCancel() {
        if (window.confirm("Ønsker du å avlyse arrangementet?") === true) {
            setCancelled(true)
            console.log("Cancelled")
        } else {
            console.log("No change")
        }
    }
}

