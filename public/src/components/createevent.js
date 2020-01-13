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
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import {authService} from "../AuthService";
const jwt = require("jsonwebtoken");

//TODO: Sjekke om artist er allerede lagt inn
//TODO: Hente ut organizerId fra bruker
//TODO: Legge til annet personell
//TODO: Legge til bilde

export class AddEvent extends Component{

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
        this.rider = this.handleRiderChange.bind(this);
        this.contract = this.handleContractChange.bind(this);
        this.artistsAdd = this.handleArtistsAdd.bind(this);
        this.artists = this.handleArtists.bind(this);
        this.imageUrl = this.handleImageUrlChange.bind(this);

        this.state = {
            organizerId: null,
            eventName: '',
            eventAddress: '',
            eventDescription: '',
            ageLimit: 0,
            fDate: new Date(),
            tDate: new Date(),
            fTime: '00:00:00',
            tTime: '00:00:00',
            rider: '',
            contract: '',
            image: '',
            imageUrl: '',
            artistsAdd: [],
            artists: [],
        };
    }

    handleEventNameChange(event){
        this.setState({eventName: event.target.value});
    };

    handleEventAddressChange(event){
        this.setState({eventAddress: event.target.value});
    }

    handleEventDescriptionChange(event){
        this.setState({eventDescription: event.target.value});
    }

    handleAgeLimitChange(event){
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

    handleSubmit() {
        if(this.state.eventName === '' ||
            this.state.eventAddress === '' ||
            this.state.eventDescription === ''){
            alert('Tomme felter! Vennligst fyll ut alle felt');
            return;
        }else if(
            this.state.tDate < this.state.fDate ||
            this.state.tTime < this.state.fTime
        ){
            alert('Fra-tidspunkt må være større enn til-tidspunkt!');
            return;
        }
        this.submit();
    }

    mergeDateTime(fdate, ftime){
        return fdate.toISOString().split("T")[0] + " " + ftime;
    }

    submit() {

        let ev = new Event();
        ev.address = this.state.eventAddress;
        ev.organizerId = this.state.organizerId;
        ev.ageLimit = this.state.ageLimit;
        ev.description = this.state.eventDescription;
        ev.startTime = this.mergeDateTime(this.state.fDate, this.state.fTime);
        ev.endTime = this.mergeDateTime(this.state.tDate, this.state.tTime);
        ev.eventName = this.state.eventName;
        ev.rider = this.state.rider;
        ev.contract = this.state.contract;
        ev.imageUrl = this.state.imageUrl;

        service.createEvent(ev)
            .then(updated =>
                {this.state.artistsAdd.map(artist =>
                    (service.createGig(
                        new Gig(artist.userId, updated.insertId, this.state.rider, this.state.contract)
                    )
                    )
                )
                }
            ).then(this.props.history.push("/opprett-arrangement"))
        .catch(err => alert('En feil oppsto!' + err.message))
    }

    render(){

        if(!(Array.isArray(this.state.artists) && this.state.artists.length)) return null;

        return(
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

                        <Form.Group as={Col} sm={"2"}>

                            <Form.Label>Artist</Form.Label>

                            <Dropdown onSelect={this.handleArtistsAdd}>

                                <Dropdown.Toggle variant={"success"} id="dropdown">
                                    Velg artist
                                </Dropdown.Toggle>

                                <Dropdown.Menu as={this.CustomMenu}>
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
                                    </React.Fragment>))}
                            </ListGroup>

                        </Form.Group>

                        <Form.Group as={Col} sm={"6"}>

                            <Form.Label>Fra Dato:</Form.Label>

                            <DatePicker
                                className="m-4 font-weight-bold"
                                id = 'fromDatePicker'
                                name = 'fdate'
                                format="y-MM-dd"
                                selected={this.state.fDate}
                                value={this.state.fDate}
                                onChange={date => this.changeDate('fdate', date)}
                            />
                            <Form.Label>kl:</Form.Label>
                            <TimePicker
                                className="m-4 font-weight-bold"
                                name='fTime'
                                disableClock={false}
                                format="HH:mm:ss"
                                locale="sv-sv-sv"
                                selected={this.state.fTime}
                                value={this.state.fTime}
                                onChange={time => this.changeTime('fTime', time)}
                            />
                        </Form.Group>

                        <Form.Group as={Col} sm={"6"}>
                            <Form.Label>Til Dato:</Form.Label>

                            <DatePicker
                                className="m-4 font-weight-bold"
                                id='toDatePicker'
                                name='tdate'
                                format="y-MM-dd"
                                selected={this.state.tDate}
                                value={this.state.tDate}
                                onChange={date => this.changeDate('tdate', date)}
                            />
                            <Form.Label>kl:</Form.Label>
                            <TimePicker
                                className=" m-4 font-weight-bold"
                                name='tTime'
                                locale="sv-sv-sv"
                                disableClock={false}
                                format="HH:mm:ss"
                                selected={this.state.tTime}
                                value={this.state.tTime}
                                onChange={time => this.changeTime('tTime', time)}
                            />
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

                        <Form.Group as={Col} sm={"12"}>
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
                                <Button type="submit" onClick={this.handleSubmit}>Opprett arrangementet</Button>
                        </Form.Group>

                    </Form.Row>
                </Form>
            </Container>
        );
    }


    mounted() {
        let token = authService.getToken();
        let decoded = jwt.decode(token);
        let userId = decoded.userId;
        this.setState({organizerId: userId});
        console.log(this.state.organizerId);
        service.getUsers().then(this.handleArtists).catch((err) => alert(err.message));
    }

    changeDate(dateName, dateValue){
        let {fDate, tDate} = this.state;
        if(dateName === 'fdate'){
            fDate = dateValue;
        }else{
            tDate = dateValue;
        }
        this.setState({
            fDate,
            tDate
        });
    }

    changeTime(timeName, timeValue){
        let{fTime, tTime} = this.state;
        if(timeName === 'fTime'){
            fTime = timeValue;
        }else{
            tTime = timeValue;
        }
        this.setState({
            fTime,
            tTime
        });
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
