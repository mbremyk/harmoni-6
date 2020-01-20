import {Gig, Event, Personnel, service, SimpleFile, Artist} from "../services";
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
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
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
        this.contract = this.handleContractChange.bind(this);
        this.artistsAdd = this.handleArtistsAdd.bind(this);
        this.artists = this.handleArtists.bind(this);
        this.imageUrl = this.handleImageUrlChange.bind(this);
        this.image = this.handleImageUpload.bind(this);
        this.personnelAdd = this.handlePersonnelAdd.bind(this);
        this.personnelRole = this.handlePersonnelRole.bind(this);

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
            contract: '',
            image: '',
            imageUrl: '',
            artistsAdd: [],
            artists: [],
            personnelAdd: [],
            personnelRole: '',
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

    handleContractChange(event, artist) {
        artist.contract = event.target.files[0];
        this.setState({contract: event.target.files[0]});
    }

    handleImageUpload(event) {
        this.setState({image: event.target.files[0]})
    }

    handleImageUrlChange(event) {
        this.setState({imageUrl: event.target.value})
    }

    handleArtistsAdd(event) {
        service.getUser(event).then((user) => this.setState({
            artistsAdd: [...this.state.artistsAdd,
                new Artist(user.userId, user.username, user.email, "", "")]
        }));
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

    handlePersonnelRole(event, personell) {
        personell.role = event.target.value
        this.setState({personnelRole: event.target.value})
    }

    handleSubmit() {

        let fDateTime = this.state.fDate + " " + this.state.fTime + ":00";
        let tDateTime = this.state.tDate + " " + this.state.tTime + ":00";

        if (this.state.image !== "") {
            this.toBase64(this.state.image).then(res => {
                this.state.imageUrl = res;

                let e = new Event(0, this.state.organizerId, this.state.eventName, this.state.eventAddress,
                    this.state.eventDescription, this.state.ageLimit, fDateTime, tDateTime, this.state.imageUrl,
                    this.state.image, this.state.cancelled);

                service.createEvent(e).then(updated => {

                    if ((Array.isArray(this.state.artistsAdd) && this.state.artistsAdd.length)) {
                        this.state.artistsAdd.map(artist => {
                            this.toBase64(artist.contract).then(cData => {
                                let contract = new SimpleFile(cData, artist.contract.name);
                                service.createGig(new Gig(updated.insertId, artist.userId, contract)).then().catch(error => console.log(error))
                            })
                        })
                    }

                    if ((Array.isArray(this.state.personnelAdd) && this.state.personnelAdd.length)) {

                        this.state.personnelAdd = this.state.personnelAdd.map(user => new Personnel(user.userId, updated.insertId, user.role));
                        service.createPersonnel(this.state.personnelAdd, updated.insertId).then(() => {
                            this.props.history.push("/arrangement/" + updated.insertId)
                        }).catch(error => console.log(error))
                    } else {
                        this.props.history.push("/arrangement/" + updated.insertId)
                    }
                }).catch(err => console.log(err))
            });
        } else {

            let e = new Event(0, this.state.organizerId, this.state.eventName, this.state.eventAddress,
                this.state.eventDescription, this.state.ageLimit, fDateTime, tDateTime, this.state.imageUrl,
                this.state.image, this.state.cancelled);

            service.createEvent(e).then(updated => {

                if ((Array.isArray(this.state.artistsAdd) && this.state.artistsAdd.length)) {
                    this.state.artistsAdd.map(artist => {
                        this.toBase64(artist.contract).then(cData => {
                            let contract = new SimpleFile(cData, artist.contract.name);
                            service.createGig(new Gig(updated.insertId, artist.userId, contract)).then().catch(error => console.log(error))
                        })
                    })
                }

                if ((Array.isArray(this.state.personnelAdd) && this.state.personnelAdd.length)) {

                    this.state.personnelAdd = this.state.personnelAdd.map(user => new Personnel(user.userId, updated.insertId, user.role));
                    service.createPersonnel(this.state.personnelAdd, updated.insertId).then(() => {
                        this.props.history.push("/arrangement/" + updated.insertId)
                    }).catch(error => console.log(error))
                } else {
                    this.props.history.push("/arrangement/" + updated.insertId)
                }
            }).catch(err => console.log(err))
        }
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
                    <Card className={"p-5"}>
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
                                                <Card>
                                                    <Card.Title
                                                        className="font-weight-bold text-center">{artist.username}</Card.Title>
                                                    <ListGroupItem>
                                                        <Row>

                                                            <Form.Group as={Col} sm={"5"}>
                                                                <label>Last opp kontrakt</label>
                                                                <input type="file" className="form-control"
                                                                       encType="multipart/form-data" name="file"
                                                                       onChange={event => this.handleContractChange(event, artist)}/>
                                                            </Form.Group>

                                                            <Col>
                                                            </Col>

                                                            <Col sm={"2"}>
                                                                <label>Fjern artist</label>
                                                                <Button type="button" variant={"danger"} onClick={() => {
                                                                    this.state.artistsAdd.splice(this.state.artistsAdd.indexOf(artist),1)
                                                                    this.setState({artistsAdd: this.state.artistsAdd});
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
                                                    <Row>
                                                        <Col>
                                                            {personnel.username}
                                                        </Col>

                                                        <Col>
                                                            <Form.Control
                                                                placeholder="Rollen til personen"
                                                                value={personnel.role}
                                                                onChange={event => this.handlePersonnelRole(event, personnel)}
                                                            />
                                                        </Col>

                                                        <Col>
                                                            <Button type="button" variant={"danger"} onClick={() => {
                                                                this.state.personnelAdd.splice(this.state.personnelAdd.indexOf(personnel), 1)
                                                                this.setState({personnelAdd: this.state.personnelAdd});
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
                                    <input type="file" className="form-control" encType="multipart/form-data" name="file"
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
                    </Card>
                </Container>
            </div>
        );
    }


    mounted() {
        let token = authService.getToken();
        let decoded = jwt.decode(token);
        let uId = decoded.userId;
        this.setState({organizerId: uId});
        service.getUsers().then(this.handleArtists).catch((err) => console.log(err.message));
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
