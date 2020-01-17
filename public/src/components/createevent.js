import {Gig, Event, Personnel, service, SimpleFile} from "../services";
import {Component} from "react-simplified";
import {HarmoniNavbar} from "./navbar";
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
import {authService} from "../AuthService";

const jwt = require("jsonwebtoken");

//TODO: Sjekke om artist er allerede lagt inn
//TODO: Legge til annet personell
//TODO: Legge til bilde

export class AddEvent extends Component {

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
        this.personnelAdd = this.handlePersonnelAdd.bind(this);

        this.state = {
            organizerId: '',
            eventName: '',
            eventAddress: '',
            eventDescription: '',
            ageLimit: 0,
            fDate: require('moment')().format('YYYY-MM-DD'),
            tDate: require('moment')().format('YYYY-MM-DD'),
            fTime: require('moment')().format('HH:mm'),
            tTime: require('moment')().format('HH:mm'),
            rider: '',
            contract: '',
            image: '',
            imageUrl: '',
            artistsAdd: [],
            artists: [],
            personnelAdd: [],
        };
    }

    handleEventNameChange(event) {
        this.setState({eventName: event.target.value});
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
        this.setState({rider: event.target.files[0]});
    }

    handleContractChange(event) {
        this.setState({contract: event.target.files[0]});
    }

    handleImageUpload(event) {
        this.setState({image: event.target.value})
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

    handlePersonnelAdd(event) {
        service.getUser(event).then((user) => this.setState({personnelAdd: [...this.state.personnelAdd, user]}));
    }

    handleFDate(event) {
        this.setState({fDate: event.target.value})
    }

    handleFTime(event) {
        this.setState({fTime: event.target.value})
    }

    handleTDate(event) {
        this.setState({tDate: event.target.value})
    }

    handleTTime(event) {
        this.setState({tTime: event.target.value})
    }

    handleSubmit() {

        let fDateTime = this.state.fDate + " " + this.state.fTime + ":00";
        let tDateTime = this.state.tDate + " " + this.state.tTime + ":00";

        let e = new Event(0, this.state.organizerId, this.state.eventName, this.state.eventAddress,
            this.state.eventDescription, this.state.ageLimit, fDateTime, tDateTime, this.state.imageUrl,
            this.state.image);

        service.createEvent(e).then(updated => {
            this.state.personnelAdd = this.state.personnelAdd.map(user => new Personnel(user.userId, updated.insertId, user.role));
            service.createPersonnel(this.state.personnelAdd).then((insertOk) => {
                console.log('createPersonnel: ' + insertOk);


                this.toBase64(this.state.contract).then(cData => {
                    let contract = new SimpleFile(cData, this.state.contract.name);
                    this.toBase64(this.state.rider).then(rData => {
                        let rider = new SimpleFile(rData, this.state.rider.name);
                        service.createGig(new Gig(updated.insertId, this.state.artistsAdd, contract, rider)).then((insertOk) => {
                            console.log(insertOk);
                            this.props.history.push("/opprett-arrangement")
                        })
                    }).catch(err => alert(err.message));
                })
            })
        })
    }

    toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });


    render() {

        if (!(Array.isArray(this.state.artists) && this.state.artists.length)) return null;

        return (
            <div>
                <HarmoniNavbar/>
                <Container>
                    <Form>
                        <Form.Row>

                            <Form.Group as={Col} sm={"12"}>
                                <h1 className="font-weight-bold text-center">Opprett arrangement</h1>
                            </Form.Group>

                            <Form.Group as={Col} sm={"12"}>
                                <Form.Label>Arrangementsnavn</Form.Label>
                                <Form.Control
                                    placeholder="Navn på arrangement . . ."
                                    value={this.state.eventName}
                                    onChange={this.handleEventNameChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} sm={"12"}>
                                <Form.Label>Adresse</Form.Label>
                                <Form.Control
                                    placeholder="Adresse der arrangementet skal holdes . . ."
                                    value={this.state.eventAddress}
                                    onChange={this.handleEventAddressChange}

                                />
                            </Form.Group>

                            <Form.Group as={Col} sm={12}>
                                <Form.Label>Beskrivelse</Form.Label>
                                <Form.Control
                                    placeholder="Her kan du skrive en kort beskrivelse av arrangementet (max. 500 ord) . . ."
                                    as="textarea"
                                    rows="8"
                                    value={this.state.eventDescription}
                                    onChange={this.handleEventDescriptionChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} sm={"3"}>
                                <Form.Label>Fra dato</Form.Label>
                                <Form.Control
                                    value={this.state.fDate}
                                    onChange={this.handleFDate}
                                    type={"date"}

                                />
                            </Form.Group>

                            <Form.Group as={Col} sm={"3"}>
                                <Form.Label>Fra klokkeslett</Form.Label>
                                <Form.Control
                                    value={this.state.fTime}
                                    onChange={this.handleFTime}
                                    type={"time"}

                                />
                            </Form.Group>


                            <Form.Group as={Col} sm={"3"}>
                                <Form.Label>Til dato</Form.Label>
                                <Form.Control
                                    value={this.state.tDate}
                                    onChange={this.handleTDate}
                                    type={"date"}

                                />
                            </Form.Group>

                            <Form.Group as={Col} sm={"3"}>
                                <Form.Label>Til klokkeslett</Form.Label>
                                <Form.Control
                                    value={this.state.tTime}
                                    onChange={this.handleTTime}
                                    type={"time"}

                                />
                            </Form.Group>

                            <Form.Group as={Col} sm={"2"}>

                                <Form.Label>Artist</Form.Label>

                                <Dropdown onSelect={this.handleArtistsAdd}>

                                    <Dropdown.Toggle variant={"success"} id="dropdown">
                                        Velg artist
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu style={{overflowY: 'scroll', maxHeight: "300px"}}
                                                   as={this.CustomMenu}>
                                        {this.state.artists.map(artist => (
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
                                            <ListGroupItem>
                                                {artist.username}
                                            </ListGroupItem>
                                        </React.Fragment>
                                    ))}
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
                                        {this.state.artists.map(artist => (
                                            <Dropdown.Item eventKey={artist.userId}>
                                                {artist.username}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>

                                </Dropdown>

                            </Form.Group>

                            <Form.Group as={Col} sm={"10"}>

                                <ListGroup title={"Valgt personell"}>
                                    {this.state.personnelAdd.map(personnel => (
                                        <React.Fragment key={personnel.userId}>

                                            <ListGroupItem>
                                                {personnel.username}
                                                <Form.Control
                                                    placeholder="Rollen til personen"
                                                    value={personnel.role}
                                                    onChange={(event) => personnel.role = event.target.value}
                                                />
                                            </ListGroupItem>
                                        </React.Fragment>
                                    ))}
                                </ListGroup>
                            </Form.Group>

                            <Form.Group as={Col} sm={"6"}>
                                <Form.Label>Last opp et forsidebilde til arrangementet</Form.Label>
                                <InputGroup className="mb-5">
                                    <FormControl
                                        type="file"
                                        value={this.state.image}
                                        onChange={this.handleImageUpload}
                                    />
                                </InputGroup>
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
                                <label>Last opp rider</label>
                                <input type="file" className="form-control" encType="multipart/form-data" name="file"
                                       onChange={this.handleRiderChange}/>
                            </Form.Group>

                            <Form.Group as={Col} sm={"6"}>
                                <label>Last opp kontrakt</label>
                                <input type="file" className="form-control" encType="multipart/form-data" name="file"
                                       onChange={this.handleContractChange}/>
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
                                            <InputGroup.Text id="btnGroupAddon">år</InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>

                                </ButtonToolbar>
                            </Form.Group>

                            <Form.Group as={Col} md={{span: 3, offset: 5}}>
                                <Button type="button" onClick={this.handleSubmit}>Opprett arrangementet</Button>
                            </Form.Group>

                        </Form.Row>
                    </Form>
                </Container>
            </div>
        );
    }


    mounted() {
        let token = authService.getToken();
        let decoded = jwt.decode(token);
        let uId = decoded.userId;
        this.setState({organizerId: uId});
        service.getUsers().then(this.handleArtists).catch((err) => alert(err.message));
    }


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
}
