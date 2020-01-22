import {service, Event, Gig, Ticket, Personnel} from "../services";
import {Component} from "react-simplified";
import React from "react";
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
import {DownloadWidget} from "../widgets";

export class EditEvent extends Component {

    CustomMenu = React.forwardRef(
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

    constructor(props) {
        super(props);

        this.eventName = this.handleEventNameChange.bind(this);
        this.eventAddress = this.handleEventAddressChange.bind(this);
        this.eventDescription = this.handleEventDescriptionChange.bind(this);
        this.ageLimit = this.handleAgeLimitChange.bind(this);
        this.fDate = this.handleFDate.bind(this);
        this.fTime = this.handleFTime.bind(this);
        this.tDate = this.handleTDate.bind(this);
        this.tTime = this.handleTTime.bind(this);
        this.rider = this.handleRiderChange.bind(this);
        this.contract = this.handleContractChange.bind(this);
        this.artistsAdd = this.handleArtistsAdd.bind(this);
        this.artists = this.handleArtists.bind(this);
        this.imageUrl = this.handleImageUrlChange.bind(this);
        this.image = this.handleImageUpload.bind(this);
        this.personnel = this.handlePersonnelFromDatabase.bind(this);
        this.personnelAdd = this.handlePersonnelAdd.bind(this);
        this.city = this.handleCityChange.bind(this);
        this.placeDescription = this.handlePlaceDescriptionChange.bind(this);
        this.ticketType = this.handleTicketType.bind(this);
        this.ticketPrice = this.handleTicketPrice.bind(this);
        this.ticketAmount = this.handleTicketAmount.bind(this);
        this.tickets = this.handleTickets.bind(this);
        this.tickets = this.handleTicketsAdd.bind(this);
        this.updatedTickets = this.handleTicketsUpdate.bind(this);

        this.state = {
            eventId: 0,
            organizerId: 0,
            eventName: '',
            eventAddress: '',
            city: '',
            placeDescription: '',
            eventDescription: '',
            ageLimit: 0,
            fDate: require('moment')().format('YYYY-MM-DD'),
            tDate: require('moment')().format('YYYY-MM-DD'),
            fTime: require('moment')().format('HH:mm'),
            tTime: require('moment')().format('HH:mm'),
            maxTime: moment('23:59', 'HH:mm').format('HH:mm'),
            minTime: moment('00:00', 'HH:mm').format('HH:mm'),
            rider: '',
            contract: '',
            image: '',
            imageUrl: '',
            artistsAdd: [],
            artists: [],

            personnel: [], //all personnel used to render them on the page
            personnelUpdate: [], //personnel already registered
            personnelAdd: [], //personnel added
            personnelRemove: [], //personnel for removal

            cancelled: 0,
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
    }

    handleEventNameChange(event) {
        this.setState({eventName: event.target.value});
    }

    handleCityChange(event) {
        this.setState({city: event.target.value});
    }

    handlePlaceDescriptionChange(event) {
        this.setState({placeDescription: event.target.value});
    }

    handleEventAddressChange(event) {
        this.setState({eventAddress: event.target.value});
    }

    handleEventDescriptionChange(event) {
        this.setState({eventDescription: event.target.value});
    }

    handleAgeLimitChange(event) {
        this.setState({ageLimit: event.target.value});
    }

    handleRiderChange(event) {
        this.setState({rider: event.target.value})
    }

    handleContractChange(event) {
        this.setState({contract: event.target.value})
    }

    handleImageUpload(event) {
        this.setState({image: event.target.files[0]})
    }

    handleImageUrlChange(event) {
        this.setState({imageUrl: event.target.value})
    }

    handleArtistsAdd(event) {
        service.getUser(event).then((user) => this.setState({artistsAdd: [...this.state.artistsAdd, user]}));
    }

    handleArtists(event) {
        this.setState({artists: [...this.state.artists, ...event]})
    }

    handleFDate(event) {
        this.setState({fDate: event.target.value});
        this.handleMaxMinTime();
    }

    handleFTime(event) {
        this.setState({fTime: event.target.value});
        this.handleMaxMinTime();
    }

    handleTDate(event) {
        this.setState({tDate: event.target.value});
        this.handleMaxMinTime();
    }

    handleTTime(event) {
        this.setState({tTime: event.target.value});
        this.handleMaxMinTime();
    }

    handleMaxMinTime() {
        if (this.state.fDate === this.state.tDate) {
            this.setState({maxTime: this.state.tTime});
            this.setState({minTime: this.state.fTime});
        } else {
            this.setState({minTime: moment('00:00', 'HH:mm').format('HH:mm')});
            this.setState({maxTime: moment('23:59', 'HH:mm').format('HH:mm')});
        }
    }

    handlePersonnelRole(event, personnel) {
        personnel.role = event.target.value;
        this.setState({personnelRole: event.target.value})

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
            //if personnel isnt in database
            this.state.personnelAdd.splice(this.state.personnelAdd.indexOf(personnel), 1);
        }
    }

    updatePersonnel = () => new Promise((resolve, reject) => {
        let promises = [];

        //if user has chosen to remove personnel, then remove them from the database
        if (Array.isArray(this.state.personnelRemove) && this.state.personnelRemove.length > 0) {
            console.log('remove', this.state.personnelRemove);
            promises.push(this.state.personnelRemove.map(personnel => service.deletePersonnel(this.state.eventId, personnel.personnelId).catch(error => reject(error))))
        }

        //if there are any old personnel left, update their role in the database
        if (Array.isArray(this.state.personnelUpdate) && this.state.personnelUpdate.length > 0) {
            console.log('update', this.state.personnelUpdate);
            promises.push(service.updatePersonnel(this.state.personnelUpdate).catch(error => reject(error)))
        }

        //if there are new personnel added, then add them to database
        if (Array.isArray(this.state.personnelAdd) && this.state.personnelAdd.length > 0) {
            console.log('add', this.state.personnelAdd);
            promises.push(service.addPersonnel(this.state.personnelAdd).catch(error => reject(error)))
        }

        Promise.all(promises).then(() => resolve(true)).catch(error => reject(error));
    });


    /*
    Submit
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

    handleTickets(event) {
        this.setState({tickets: [...this.state.tickets, ...event]});
    }

    handleTicketsAdd() {
        this.setState({addedTickets: [this.state.addedTickets, new Ticket(this.state.eventId, this.state.ticketType, this.state.ticketPrice, this.state.ticketAmount)]})
    }

    handleTicketsUpdate(event) {
        this.setState({tickets: [...this.state.updatedTickets, event]})
    }

    handleTicketsTypeChange(event, ticket) {
        ticket.type = event.target.value;
        this.setState({tickets: [...this.state.tickets]})
    }

    handleTicketsPriceChange(event, ticket) {
        ticket.price = event.target.value;
        this.setState({tickets: [...this.state.tickets]})
    }

    handleTicketsAmountChange(event, ticket) {
        ticket.amount = event.target.value;
        this.setState({tickets: [...this.state.tickets]})
    }

    handleTicketsRemoval(event, ticket) {
        if (this.state.tickets.indexOf(ticket) >= 0) {
            this.state.tickets.splice(this.state.tickets.indexOf(ticket), 1);
            this.setState({deletedTickets: [...this.state.deletedTickets, ticket]})
        } else if (this.state.addedTickets.indexOf(ticket) >= 0) {
            this.state.addedTickets.splice(this.state.tickets.indexOf(ticket), 1);
        } else if (this.state.updatedTickets.indexOf(ticket) >= 0) {
            this.state.updatedTickets.splice(this.state.tickets.indexOf(ticket), 1);

        }
    }

    setError(message, variant) {
        this.setState({error: message, errorType: variant});
        setTimeout(() => this.setState({error: '', errorType: 'primary'}), 5000);
    }

    handleSubmit() {
        let errmsg = "";
        // check empty fields
        if (!this.state.eventName || !this.state.eventAddress || !this.state.eventDescription || !this.state.city) {
            errmsg += 'Følgende mangler:';
            if (!this.state.eventName) errmsg += " [ Arrangementsavn ] ";
            if (!this.state.eventAddress) errmsg += "  [ Addresse ] ";
            if (!this.state.eventDescription) errmsg += "  [ Beskrivelse ] ";
            if (!this.state.city) errmsg += "  [ By ] ";
            this.setError(errmsg, 'danger');
            return;
        }


        let fDateTime = this.state.fDate + " " + this.state.fTime + ":00";
        let tDateTime = this.state.tDate + " " + this.state.tTime + ":00";

        this.toBase64(this.state.image).then(image => {

            let ev = new Event(
                this.state.eventId,
                this.state.organizerId,
                this.state.eventName,
                this.state.city,
                this.state.eventAddress,
                this.state.placeDescription,
                this.state.eventDescription,
                this.state.ageLimit,
                fDateTime, tDateTime,
                (image ? image : this.state.imageUrl),
                this.state.cancelled);

            service.updateEvent(ev).then(() => {
                this.updatePersonnel().then(() => {
                    this.props.history.push("/arrangement/" + this.state.eventId);
                })
            });
        });
    }


    render() {

        if (!(Array.isArray(this.state.artists) && this.state.artists.length)) return null;

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

                                <Form.Group as={Col} sm={"12"}>
                                    <Form.Label>Arrangementsnavn</Form.Label>
                                    <Form.Control
                                        placeholder="Navn på arrangement . . ."
                                        value={this.state.eventName}
                                        onChange={this.handleEventNameChange}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"6"}>
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control
                                        placeholder="Adresse der arrangementet skal holdes . . ."
                                        value={this.state.eventAddress}
                                        onChange={this.handleEventAddressChange}

                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"6"}>
                                    <Form.Label>By</Form.Label>
                                    <Form.Control
                                        placeholder="By der arrangementet skal holdes . . ."
                                        value={this.state.city}
                                        onChange={this.handleCityChange}

                                    />
                                </Form.Group>


                                <Form.Group as={Col} sm={12}>
                                    <Form.Label>Stedsanvisning</Form.Label>
                                    <Form.Control
                                        placeholder="Her kan du f.eks skrive anvisning for hvordan man kan finne fram til der arrangementet holdes . . ."
                                        as="textarea"
                                        rows="8"
                                        value={this.state.placeDescription}
                                        onChange={this.handlePlaceDescriptionChange}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={12}>
                                    <Form.Label>Beskrivelse</Form.Label>
                                    <Form.Control
                                        placeholder="Her kan du skrive en beskrivelse av arrangementet . . ."
                                        as="textarea"
                                        rows="8"
                                        value={this.state.eventDescription}
                                        onChange={this.handleEventDescriptionChange}
                                    />
                                </Form.Group>


                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Fra dato</Form.Label>
                                    <Form.Control
                                        max={this.state.tDate}
                                        value={this.state.fDate}
                                        onChange={this.handleFDate}
                                        type={"date"}

                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Fra klokkeslett</Form.Label>
                                    <Form.Control
                                        max={this.state.maxTime}
                                        value={this.state.fTime}
                                        onChange={this.handleFTime}
                                        type={"time"}
                            />
                                    <span className="customStyle"/>
                                </Form.Group>


                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Til dato</Form.Label>
                                    <Form.Control
                                        min={this.state.fDate}
                                        value={this.state.tDate}
                                        onChange={this.handleTDate}
                                        type={"date"}
                            />
                        </Form.Group>

                                <Form.Group as={Col} sm={"3"}>
                                    <Form.Label>Til klokkeslett</Form.Label>
                                    <Form.Control
                                        min={this.state.minTime}
                                        value={this.state.tTime}
                                        onChange={this.handleTTime}
                                        type={"time"}
                            />
                                    <span className="customStyle"/>
                                </Form.Group>


                                <Form.Group as={Col} sm={"2"}>

                                    <Form.Label>Artist</Form.Label>

                                    <Dropdown onSelect={this.handleArtistsAdd}>

                                        <Dropdown.Toggle variant={"success"} id="dropdown">
                                            Velg artist
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu style={{overflowY: 'scroll', maxHeight: "300px"}}
                                                       as={this.CustomMenu}>
                                            {this.state.artists.filter(artist => !this.state.artistsAdd.some(e => e.userId === artist.userId)).map(artist => (
                                                <Dropdown.Item eventKey={artist.userId}>
                                                    {artist.username}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>

                                    </Dropdown>

                                </Form.Group>

                                <Form.Group as={Col} sm={"10"}>

                                    <ListGroup title={"Valgte artister"}>
                                        {this.state.artistsAdd.map(artist => (
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
                                                                       onChange={this.handleContractChange}/>
                                                            </Form.Group>

                                                            <Col sm={""}>
                                                                <DownloadWidget artist={artist.userId}
                                                                                event={this.state.eventId}/>
                                                            </Col>

                                                            <Col sm={""}>
                                                                <label>Fjern artist</label>
                                                                <Button type="button" variant={"danger"}
                                                                        onClick={() => {
                                                                            this.state.artistsAdd.splice(this.state.artistsAdd.indexOf(artist), 1);
                                                                            this.setState({artistsAdd: this.state.artistsAdd});
                                                                        }
                                                                        }>Fjern</Button>
                                                            </Col>
                                                        </Row>
                                                    </ListGroupItem>
                                                </Card>
                                            </React.Fragment>))}
                                    </ListGroup>

                                </Form.Group>


                                <Form.Group as={Col} sm={"2"}>

                                    <Form.Label>Personell</Form.Label>

                                    <Dropdown onSelect={this.handlePersonnelAdd}>

                                        <Dropdown.Toggle variant={"success"} id="dropdown">
                                            Velg personell
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu style={{overflowY: 'scroll', maxHeight: "300px"}}
                                                       as={this.CustomMenu}>
                                            {this.state.artists.filter(users => !this.state.personnel.some(e => (e.personnelId === users.userId))).map(user => (
                                                <Dropdown.Item eventKey={user.userId}>
                                                    {user.username}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>

                                    </Dropdown>

                                </Form.Group>

                                <Form.Group as={Col} sm={"10"}>

                                    <ListGroup title={"Valgt personell"}>
                                        {this.state.personnel.map(personnel => (
                                            <React.Fragment key={personnel.personnelId}>
                                                <ListGroupItem>
                                                    <Row>
                                                        <Col>
                                                            {personnel.user.username}
                                                        </Col>

                                                        <Col>
                                                            <Form.Control
                                                                placeholder="Rollen til personen"
                                                                value={personnel.role}
                                                                onChange={event => this.handlePersonnelRoleChange(event, personnel)}
                                                            />
                                                        </Col>

                                                        <Col>
                                                            <Button type="button" variant={"danger"}
                                                                    onClick={() => this.handlePersonnelRemoval(personnel)}>X</Button>
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
                                           onChange={this.handleImageUpload}/>
                                </Form.Group>

                                <Form.Group as={Col} sm={"6"}>
                                    <Form.Label>Eller legg inn en bilde-url</Form.Label>
                                    <Form.Control
                                        placeholder="Bilde-url"
                                        value={this.state.imageUrl}
                                        onChange={this.handleImageUrlChange}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"6"}>

                                    <Form.Label>Aldersgrense</Form.Label>
                                    <ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups">
                                        <ButtonGroup className="mr-2" aria-label="button-group">
                                            <Button onClick={this.decrementAge}>-</Button>
                                            <Button onClick={this.IncrementAge}>+</Button>
                                        </ButtonGroup>

                                        <InputGroup>
                                            <FormControl
                                                type="input"
                                                value={this.state.ageLimit}
                                                onChange={this.handleAgeLimitChange}
                                                aria-label="btn-age"
                                                aria-describedby="btnGroupAddon"
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text>år</InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>

                                    </ButtonToolbar>
                                </Form.Group>
                            </Form.Row>

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
                                    <Button type="button" variant={"success"} onClick={this.handleSubmit}>Lagre</Button>
                                </Col>

                                <Col>
                                    <Button variant={"danger"} type="button"
                                            onClick={this.handleEventCancel}>Avlys</Button>
                                </Col>

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

                                <Col>
                                <Button variant={"danger"} onClick={this.handleDelete}>Slett</Button>
                                </Col>

                            </Row>
                        </Form>
                    </Card>
                </Container>
            </div>
        );
    }


    mounted() {
        service.getEventByEventId(this.props.match.params.id).then(event => {

            let fromDateTime = event.startTime.split(" ");
            let toDateTime = event.endTime.split(" ");
            let fromDate = fromDateTime[0];
            let toDate = toDateTime[0];
            let fromTime = fromDateTime[1];
            let toTime = toDateTime[1];

            this.setState({eventId: event.eventId});
            this.setState({organizerId: event.organizerId});
            this.setState({eventName: event.eventName});
            this.setState({eventAddress: event.address});
            this.setState({eventDescription: event.description});
            this.setState({ageLimit: event.ageLimit});
            this.setState({imageUrl: event.imageUrl});
            this.setState({fDate: fromDate});
            this.setState({tDate: toDate});
            this.setState({fTime: fromTime});
            this.setState({tTime: toTime});
            this.setState({cancelled: event.cancelled});
            this.setState({city: event.city});
            this.setState({placeDescription: event.placeDescription});

            service.getUsers().then(this.handleArtists).catch((err) => console.log(err.message));
            service.getTicketToEvent(this.props.match.params.id).then(this.handleTickets).catch((err) => console.log(err.message));
            service.getPersonnel(this.props.match.params.id).then(this.handlePersonnelFromDatabase).catch((err) => console.log(err.message));
            service.getGigs(this.props.match.params.id).then(g => {
                g.map(u => this.handleArtistsAdd(u.artistId));
            })
                .catch((err) => console.log(err.message));
        }).catch((error) => console.log(error.message));
    }

    toBase64 = (file) => new Promise((resolve, reject) => {
        if (file === "") {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });


    IncrementAge() {
        this.state.ageLimit++;
        this.setState({ageLimit: this.state.ageLimit});
    }

    decrementAge() {
        if (this.state.ageLimit > 0) {
            this.state.ageLimit--;
            this.setState({ageLimit: this.state.ageLimit})
        }
    }

    handleDelete = () => {
        if (window.confirm("Er du sikker på at du vil slette arrangementet? \nDette kan ikke angres")) {
            service.deleteEvent(this.state.eventId).then(() => {
                this.props.history.push("/hjem")
                alert("Arrangementet er nå slettet")
            });
        }
    };

    handleEventCancel = () => {
        if (window.confirm("Ønsker du å avlyse arrangementet?") === true) {
            this.setState({cancelled: true});
            console.log("Cancelled")
        } else {
            console.log("No change")
        }
    };
}
