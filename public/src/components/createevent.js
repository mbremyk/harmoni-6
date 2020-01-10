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
        this.artists = this.handleArtists.bind(this);

        this.state = {
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
            artists: [],
        };
    }

    handleEventNameChange(event){
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

    handleArtists(event){
        this.setState({artists: event.target.value})
    }

    handleSubmit(){
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
        this.submit()
    }

    mergeDateTime(fdate, ftime){
        return fdate + " " + ftime;
    }

    submit(){
        let ev = new Event();
        ev.adress = this.state.eventAddress;
        ev.ageLimit = this.state.ageLimit;
        ev.description = this.state.eventDescription;
        ev.startDate = this.mergeDateTime(this.state.fDate, this.state.fTime);
        ev.endDate = this.mergeDateTime(this.state.tDate, this.state.tTime);
        ev.eventName = this.state.eventName;
        ev.rider = this.state.rider;
        ev.contract = this.state.contract;


        service.createEvent(ev)
            .then(updated =>
            {this.state.artists.map(() =>
                (service.createGig(updated.insertId, this.state.rider, this.state.contract)))}

                )
        .catch(err => alert('En feil oppsto!' + err.message))


    }

    render(){
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

                            <Dropdown onSelect={(eventKey) => this.addArtist(eventKey)}>

                                <Dropdown.Toggle variant={"success"} id="dropdown">
                                    Velg artist
                                </Dropdown.Toggle>

                                <Dropdown.Menu as={this.CustomMenu}>
                                    <Dropdown.Item eventKey="Marius">Marius</Dropdown.Item>
                                    <Dropdown.Item eventKey="Jakob">Jakob</Dropdown.Item>
                                    <Dropdown.Item eventKey="Steffen">Steffen</Dropdown.Item>
                                    <Dropdown.Item eventKey="Jan">Jan</Dropdown.Item>
                                </Dropdown.Menu>

                            </Dropdown>

                        </Form.Group>

                        <Form.Group as={Col} sm={"10"}>

                            <ListGroup title={"Valgte artister"}>
                                {this.state.artists.map(artist => (
                                    <React.Fragment key={artist}>
                                        <ListGroupItem>
                                            {artist}
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
                                format={"yyyy-MM-dd"}
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
                                format="yyyy-MM-dd"
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
                                <Button type="submit" onClick={this.handleSubmit}>Opprett arrangementet</Button>
                        </Form.Group>

                    </Form.Row>
                </Form>
            </Container>
        );
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

    addArtist(eventKey) {
        this.setState({
            artists: [...this.state.artists, eventKey]
        })
    }
}
