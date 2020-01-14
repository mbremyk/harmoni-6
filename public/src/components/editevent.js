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
        this.rider = this.handleRiderChange.bind(this);
        this.contract = this.handleContractChange.bind(this);
        this.artistsAdd = this.handleArtistsAdd.bind(this);
        this.artists = this.handleArtists.bind(this);

        this.state = {
            eventId: 0,
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
            artistsAdd: [],
            artists: [],
        };
    }

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
        this.setState({ageLimit: event.target.value});
    }

    handleRiderChange(event){
        this.setState({rider: event.target.value})
    }

    handleContractChange(event){
        this.setState({contract: event.target.value})
    }

    handleArtistsAdd(event){
        service.getUser(event).then((user) => this.setState({artistsAdd: [...this.state.artistsAdd, user]}));
    }

    handleArtists(event){
        this.setState({artists: [...this.state.artists, ...event]})
    }

    handleSubmit() {
        this.submit()
    }

    mergeDateTime(fdate, ftime) {
        return fdate.toISOString().split("T")[0] + " " + ftime;
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
                                format="dd-MM-y"
                                selected={this.state.fDate}
                                value={this.state.fDate}
                                onChange={date => this.changeDate('fdate', date)}
                            />
                            <Form.Label>kl:</Form.Label>
                            <TimePicker
                                className="m-4 font-weight-bold"
                                name='fTime'
                                disableClock={false}
                                format="HH:mm"
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
                                format="dd-MM-y"
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
                                format="HH:mm"
                                selected={this.state.tTime}
                                value={this.state.tTime}
                                onChange={time => this.changeTime('tTime', time)}
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

                        <Form.Group as={Col}  md={{span: 3, offset: 5}}>
                            <Button type="submit" onClick={this.handleSubmit}>Endre arragament</Button>
                        </Form.Group>

                    </Form.Row>
                </Form>
            </Container>
        );
    }


    mounted() {
        service.getEventByEventId(this.props.match.params.id).then(event => {
            let fromDateTime = event.startTime.split(" ");
            let toDateTime = event.endTime.split(" ");

            let fromDate = fromDateTime[0].split("/");
            let toDate = toDateTime[0].split("/");

            let fromTime = fromDateTime[1];
            let toTime = toDateTime[1];


            console.log(fromDateTime)
            console.log(toDateTime)
            console.log(fromDate)
            console.log(toDate)
            console.log(fromTime)
            console.log(toTime)

            this.setState({eventId: event.eventId});
            this.setState({eventName: event.eventName});
            this.setState({eventAddress: event.address});
            this.setState({eventDescription: event.description});
            this.setState({ageLimit: event.ageLimit});
            this.setState({fDate: new Date(fromDate[2],fromDate[1]-1,fromDate[0])});
            this.setState({tDate: new Date(toDate[2], toDate[1]-1, toDate[0])});
            this.setState({fTime: fromTime});
            this.setState({tTime: toTime});

            service.getUsers().then(this.handleArtists).catch((err) => console.log(err.message));
        }).catch((error) => console.log(error.message));
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

    submit() {

        let fDate = this.mergeDateTime(this.state.fDate, this.state.fTime);
        let tDate = this.mergeDateTime(this.state.tDate, this.state.tTime);

        let ev = new Event(this.state.eventId, 1, this.state.eventName, this.state.eventAddress,
            this.state.ageLimit, this.state.eventDescription, fDate, tDate, "", "");

        service.updateEvent(ev)
    }
}
