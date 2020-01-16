import {service, Event, Gig} from "../services";
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

export class EditEvent extends Component{

    CustomMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
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
            eventId: 0,
            organizerId: 0,
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
            cancelled: 0
        };
    }

    handleEventCancel = () =>{
        if (window.confirm("Ønsker du å avlyse arrangementet?") === true) {
            this.setState({cancelled: true});
            console.log("Cancelled")
        } else {
            console.log("No change")
        }
    };

    handleEventNameChange(event) {
        this.setState({eventName: event.target.value});
    }

    handleEventAddressChange(event){
        this.setState({eventAddress: event.target.value});
    }

    handleEventDescriptionChange(event){
        this.setState({eventDescription: event.target.value});
    }

    handleAgeLimitChange(event){
        console.log(event.target.value)
        this.setState({ageLimit: event.target.value});
    }

    handleRiderChange(event){
        this.setState({rider: event.target.value})
    }

    handleContractChange(event){
        this.setState({contract: event.target.value})
    }

    handleImageUpload(event){
        this.setState({image: event.target.value})
    }

    handleImageUrlChange(event){
        this.setState({imageUrl: event.target.value})
    }

    handleArtistsAdd(event){
        service.getUser(event).then((user) => this.setState({artistsAdd: [...this.state.artistsAdd, user]}));
    }

    handleArtists(event){
        this.setState({artists: [...this.state.artists, ...event]})
    }

    handlePersonnel(event){
        this.setState({personnelAdd: [...this.state.personnelAdd, ...event]})
    }

    handlePersonnelAdd(event){
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
        let fDateTime = this.state.fDate + " " + this.state.fTime +":00";
        let tDateTime = this.state.tDate + " " + this.state.tTime +":00";

        let ev = new Event(this.state.eventId, this.state.organizerId, this.state.eventName, this.state.eventAddress,
            this.state.eventDescription, this.state.ageLimit, fDateTime, tDateTime, this.state.imageUrl, "", this.state.cancelled);

        service.updateEvent(ev).then(this.props.history.push("/arrangement/" + this.state.eventId));
    }

    render() {

        if(!(Array.isArray(this.state.artists) && this.state.artists.length)) return null;

        return(
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

                                <Dropdown.Menu style = {{overflowY: 'scroll', maxHeight:"300px"}}  as={this.CustomMenu}>
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
                                                {console.log(artist.username)}
                                            </ListGroupItem>
                                        </React.Fragment>))}
                                </ListGroup>

                            </Form.Group>


                        <Form.Group as={Col} sm={"2"}>

                            <Form.Label>Personell</Form.Label>

                            <Dropdown onSelect={this.handlePersonnelAdd}>

                                <Dropdown.Toggle variant={"success"} id="dropdown">
                                    Velg personell
                                </Dropdown.Toggle>

                                <Dropdown.Menu style = {{overflowY: 'scroll', maxHeight:"300px"}} as={this.CustomMenu}>
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
                                            {personnel.user.username}
                                            <Form.Control
                                                placeholder="Rollen til personen"
                                                value={personnel.role}
                                                onChange={(event) => personnel.role = event.target.value}
                                            />
                                        </ListGroupItem>
                                    </React.Fragment>
                                ))}
                            </ListGroup>
                            {this.state.personnelAdd.map(p => console.log(p))}
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
                                <Form.Label>Last opp rider</Form.Label>
                                <InputGroup className="mb-5">
                                    <FormControl
                                        type="file"
                                        value={this.state.rider}
                                        onChange={this.handleRiderChange}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} sm={"6"}>
                                <Form.Label>Last opp kontrakt</Form.Label>
                                <InputGroup className="mb-5">
                                    <FormControl
                                        type="file"
                                        value={this.state.contract}
                                        onChange={this.handleRiderChange}
                                    />
                                </InputGroup>
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

                            <Form.Group as={Col}  md={{span: 3, offset: 5}}>
                                <Button variant={"danger"} type="button" onClick={this.handleEventCancel}>Avlys arrangement</Button>
                            </Form.Group>
                        <Form.Group as={Col}  md={{span: 3, offset: 5}}>
                            <Button type="button" onClick={this.handleSubmit}>Endre arragament</Button>
                        </Form.Group>

                        </Form.Row>
                    </Form>
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

            service.getUsers().then(this.handleArtists).catch((err) => console.log(err.message));
            service.getPersonnel(this.props.match.params.id).then(this.handlePersonnel).catch((err) => console.log(err.message));
            service.getGigForEvent(this.props.match.params.id)
                .then(g => {
                    console.log(g);
                    g.map(u => this.handleArtistsAdd(u.artistId));
                })
                .catch((err) => console.log(err.message));
        }).catch((error) => console.log(error.message));
    }

    IncrementAge(){
        this.state.ageLimit++;
        this.setState({ageLimit: this.state.ageLimit});
    }

    decrementAge(){
        if (this.state.ageLimit > 0) {
            this.state.ageLimit--;
            this.setState({ageLimit: this.state.ageLimit})
        }
    }
}
