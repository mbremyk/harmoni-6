import {Event, Gig, Personnel, service, SimpleFile, ToBase64} from "../services";
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
//import {Event, service} from "../services";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";

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
        this.city = this.handleCityChange.bind(this);
        this.eventAddress = this.handleEventAddressChange.bind(this);
        this.placeDescription = this.handlePlaceDescriptionChange.bind(this);
        this.eventDescription = this.handleEventDescriptionChange.bind(this);
        this.imageUrl = this.handleImageUrlChange.bind(this);
        this.ageLimit = this.handleAgeLimitChange.bind(this);
        this.fDate = this.handleFDate.bind(this);
        this.fTime = this.handleFTime.bind(this);
        this.tDate = this.handleTDate.bind(this);
        this.tTime = this.handleTTime.bind(this);

        this.gigsOld = this.handleGigsFromDatabase.bind(this);
        this.personnel = this.handlePersonnelFromDatabase.bind(this);

        this.state = {
            eventId: 0,
            organizerId: 0,
            eventName: '',
            city: '',
            eventAddress: '',
            placeDescription: '',
            eventDescription: '',
            imageUrl: '',
            ageLimit: 0,
            fDate: require('moment')().format('YYYY-MM-DD'),
            tDate: require('moment')().format('YYYY-MM-DD'),
            fTime: require('moment')().format('HH:mm'),
            tTime: require('moment')().format('HH:mm'),
            cancelled: 0,

            users: [],

            gigsOld: [],
            gigsNew: [],
            gigsRemove: [],

            personnel: [], //all personnel used to render them on the page
            personnelUpdate: [], //personnel already registered
            personnelAdd: [], //personnel added
            personnelRemove: [], //personnel for removal
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

    handleImageUpload(event) {
        let image = event.target.files[0];
        service.toBase64(image).then(imageData => {
            this.setState({imageUrl: imageData})
        })
    }

    handleImageUrlChange(event) {
        this.setState({imageUrl: event.target.value})
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

    handleUsers(event) {
        this.setState({users: [...this.state.users, ...event]});
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
            //if personnel isnt in database
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
    Submit
     */


    handleSubmit() {

        let fDateTime = this.state.fDate + " " + this.state.fTime + ":00";
        let tDateTime = this.state.tDate + " " + this.state.tTime + ":00";

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
            this.state.imageUrl,
            this.state.cancelled);

        service.updateEvent(ev).then(() => {
            this.updatePersonnel().then(() => {
                this.updateGigs().then(() => {
                    this.props.history.push("/arrangement/" + ev.eventId);
                })
            })
        });
    }


    render() {

        if (!(Array.isArray(this.state.users) && this.state.users.length)) return null;

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
                                        placeholder="Navn på arrangement"
                                        value={this.state.eventName}
                                        onChange={this.handleEventNameChange}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"6"}>
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control
                                        placeholder="Adresse der arrangementet skal holdes"
                                        value={this.state.eventAddress}
                                        onChange={this.handleEventAddressChange}

                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={"6"}>
                                    <Form.Label>By</Form.Label>
                                    <Form.Control
                                        placeholder="By der arrangementet skal holdes"
                                        value={this.state.city}
                                        onChange={this.handleCityChange}

                                    />
                                </Form.Group>


                                <Form.Group as={Col} sm={12}>
                                    <Form.Label>Plass beskrivelse</Form.Label>
                                    <Form.Control
                                        placeholder="For eksempel 3. etajse"
                                        as="textarea"
                                        rows="8"
                                        value={this.state.placeDescription}
                                        onChange={this.handlePlaceDescriptionChange}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} sm={12}>
                                    <Form.Label>Beskrivelse</Form.Label>
                                    <Form.Control
                                        placeholder="Her kan du skrive en beskrivelse av arrangementet"
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

                                    <Dropdown onSelect={this.handleGigAdd}>

                                        <Dropdown.Toggle variant={"success"} id="dropdown">
                                            Velg artist
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu style={{overflowY: 'scroll', maxHeight: "300px"}}
                                                       as={this.CustomMenu}>
                                            {this.state.users.filter(user => {
                                                if (this.state.gigsOld.some(gig => user.userId === gig.artistId)) return false;
                                                return !this.state.gigsNew.some(gig => user.userId === gig.artistId);
                                            }).map(user => (
                                                <Dropdown.Item eventKey={user.userId}>
                                                    {user.username}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>

                                    </Dropdown>

                                </Form.Group>

                                <Form.Group as={Col} sm={"10"}>

                                    <ListGroup title={"Valgte giger"}>
                                        {this.state.gigsOld.map(gig => (
                                            <React.Fragment key={gig.artistId}>
                                                <Card>
                                                    <Card.Title
                                                        className="font-weight-bold text-center">{gig.user.username}</Card.Title>
                                                    <ListGroupItem>
                                                        <Row>
                                                            <Col sm={""}>
                                                                <Button type="button" variant={"danger"}
                                                                        onClick={() => this.handleGigRemoval(gig)}>X</Button>
                                                            </Col>
                                                        </Row>
                                                    </ListGroupItem>
                                                </Card>
                                            </React.Fragment>))}
                                    </ListGroup>
                                    <ListGroup title={"nye giger"}>
                                        {this.state.gigsNew.map(gig => (
                                            <React.Fragment key={gig.artistId}>
                                                <Card>
                                                    <Card.Title
                                                        className="font-weight-bold text-center">{gig.user.username}</Card.Title>
                                                    <ListGroupItem>
                                                        <Row>
                                                            <Form.Group as={Col} sm={"5"}>
                                                                <label>Last opp kontrakt</label>
                                                                <input type="file" className="form-control"
                                                                       encType="multipart/form-data" name="file"
                                                                       onChange={event => this.handleContractUpload(event, gig)}/>
                                                            </Form.Group>
                                                            <Col sm={""}>
                                                                <Button type="button" variant={"danger"}
                                                                        onClick={() => this.handleGigRemoval(gig)}>X</Button>
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
                                            {this.state.users.filter(user => !this.state.personnel.some(e => (e.personnelId === user.userId))).map(user => (
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
                                                <InputGroup.Text id="btnGroupAddon">år</InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>

                                    </ButtonToolbar>
                                </Form.Group>
                            </Form.Row>

                            <Row>

                                <Col>
                                    <Button type="button" variant={"success"} onClick={this.handleSubmit}>Lagre</Button>
                                </Col>

                                <Col>
                                    <Button variant={"danger"} type="button"
                                            onClick={this.handleEventCancel}>Avlys</Button>
                                </Col>

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

            service.getUsers().then(this.handleUsers).catch((err) => console.log(err.message));
            service.getPersonnel(this.props.match.params.id).then(this.handlePersonnelFromDatabase).catch((err) => console.log(err.message));
            service.getGigs(this.props.match.params.id).then(this.handleGigsFromDatabase).catch((err) => console.log(err.message));
        }).catch((error) => console.error(error));
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
