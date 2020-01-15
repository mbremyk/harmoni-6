import {service, Event, Gig} from "../services";
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
import {useParams, useRouteMatch} from "react-router";

export default function EditEvent () {

    let match = useRouteMatch("/endre-arrangement/:id");
    let { id } = useParams();

    const [eventId, setEventId] = useState(0);
    const [organizerId, setOrganizerId] = useState(0);
    const [eventName, setEventName] = useState("");
    const [eventAddress, setEventAddress] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [ageLimit, setAgeLimit] = useState(0);
    const [fDate, setFDate] = useState(require('moment')().format('YYYY-MM-DD'));
    const [tDate, setTDate] = useState(require('moment')().format('YYYY-MM-DD'));
    const [fTime, setFTime] = useState(require('moment')().format('HH:mm'));
    const [tTime, setTTime] = useState(require('moment')().format('HH:mm'));
    const [rider, setRider] = useState("");
    const [contract, setContract] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [artistsAdd, setArtistsAdd] = useState([]);
    const [artists, setArtists] = useState([]);
    const [personnelAdd, setPersonnelAdd] = useState([]);
    const [tests, setTests] = useState([]);


    function handleSubmit() {
        let fDateTime = fDate + " " + fTime +":00";
        let tDateTime = tDate + " " + tTime +":00";

        let ev = new Event(eventId, organizerId, eventName, eventAddress,
            eventDescription, ageLimit, fDateTime, tDateTime, "", "");

        service.updateEvent(ev)
    }

    useEffect(() => {
        console.log("test")
        console.log(id);
        console.log(match.params.id);

        console.log(tests)
        console.log(tests[0])
        setTests(tests.push(1))
        console.log(tests)
        console.log(tests[0])

        service.getEventByEventId(id).then(event => {

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
            setEventDescription(event.eventDescription);
            setAgeLimit(event.ageLimit);
            setFDate(fromDate);
            setFTime(fromTime);
            setTDate(toDate);
            setTTime(toTime);

            service.getUsers().then(event => setArtists(event)).catch((err) => console.log(err.message));
        }).catch((error) => console.log(error.message));
    },[]);

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
                            value={eventName}
                            onChange={event => setEventName(event.target.value)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} sm={"12"}>
                        <Form.Label>Adresse</Form.Label>
                        <Form.Control
                            placeholder="Adresse der arrangementet skal holdes . . ."
                            value={eventAddress}
                            onChange={event => setEventAddress(event.target.value)}

                        />
                    </Form.Group>

                    <Form.Group as={Col} sm={12}>
                        <Form.Label>Beskrivelse</Form.Label>
                        <Form.Control
                            placeholder="Her kan du skrive en kort beskrivelse av arrangementet (max. 500 ord) . . ."
                            as="textarea"
                            rows="8"
                            value={eventDescription}
                            onChange={event => setEventDescription(event.target.value)}
                        />
                    </Form.Group>


                    <Form.Group as={Col} sm={"3"}>
                        <Form.Label>Fra dato</Form.Label>
                        <Form.Control
                            value={fDate}
                            onChange={event => setFDate(event.target.value)}
                            type={"date"}

                        />
                    </Form.Group>

                    <Form.Group as={Col} sm={"3"}>
                        <Form.Label>Fra klokkeslett</Form.Label>
                        <Form.Control
                            value={fTime}
                            onChange={event => setFTime(event.target.value)}
                            type={"time"}

                        />
                    </Form.Group>


                    <Form.Group as={Col} sm={"3"}>
                        <Form.Label>Til dato</Form.Label>
                        <Form.Control
                            value={tDate}
                            onChange={event => setTDate(event.target.value)}
                            type={"date"}

                        />
                    </Form.Group>

                    <Form.Group as={Col} sm={"3"}>
                        <Form.Label>Til klokkeslett</Form.Label>
                        <Form.Control
                            value={tTime}
                            onChange={event => setTTime(event.target.value)}
                            type={"time"}

                        />
                    </Form.Group>



                    <Form.Group as={Col} sm={"2"}>

                        <Form.Label>Artist</Form.Label>
                        <Dropdown onSelect={event => {
                            service.getUser(event).then((user) => {
                                console.log(artistsAdd)
                                setArtistsAdd(user)
                                console.log(artistsAdd)
                            })
                        }}>

                            <Dropdown.Toggle variant={"success"} id="dropdown">
                                Velg artist
                            </Dropdown.Toggle>

                            <Dropdown.Menu style = {{overflowY: 'scroll', maxHeight:"300px"}}  as={CustomMenu}>
                                {artists.map(artist => (
                                    <Dropdown.Item eventKey={artist.userId}>
                                        {artist.username}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>

                        </Dropdown>

                    </Form.Group>

                    <Form.Group as={Col} sm={"10"}>

                        <ListGroup title={"Valgte artister"}>
                            {artistsAdd.map(artist => (
                                <React.Fragment key={artist.userId}>
                                    <ListGroupItem>
                                        {artist.username}
                                    </ListGroupItem>
                                </React.Fragment>))}
                        </ListGroup>

                    </Form.Group>


                    <Form.Group as={Col} sm={"2"}>

                        <Form.Label>Personell</Form.Label>

                        <Dropdown onSelect={event => service.getUser(event).then((user) => setPersonnelAdd(user))}>

                            <Dropdown.Toggle variant={"success"} id="dropdown">
                                Velg personell
                            </Dropdown.Toggle>

                            <Dropdown.Menu style = {{overflowY: 'scroll', maxHeight:"300px"}} as={CustomMenu}>
                                {artists.map(artist => (
                                    <Dropdown.Item eventKey={artist.userId}>
                                        {artist.username}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>

                        </Dropdown>

                    </Form.Group>

                    <Form.Group as={Col} sm={"10"}>

                        <ListGroup title={"Valgt personell"}>
                            {personnelAdd.map(personnel => (
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
                        {personnelAdd.map(p => console.log(p))}
                    </Form.Group>


                    <Form.Group as={Col} sm={"6"}>
                        <Form.Label>Last opp et forsidebilde til arrangementet</Form.Label>
                        <InputGroup className="mb-5">
                            <FormControl
                                type="file"
                                value={image}
                                onChange={event => setImage(event)}
                            />
                        </InputGroup>
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
                        <Form.Label>Last opp rider</Form.Label>
                        <InputGroup className="mb-5">
                            <FormControl
                                type="file"
                                value={rider}
                                onChange={event => setRider(event)}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} sm={"6"}>
                        <Form.Label>Last opp kontrakt</Form.Label>
                        <InputGroup className="mb-5">
                            <FormControl
                                type="file"
                                value={contract}
                                onChange={event => setContract(event)}
                            />
                        </InputGroup>
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

                    <Form.Group as={Col}  md={{span: 3, offset: 5}}>
                        <Button type="button" onClick={handleSubmit}>Endre arragament</Button>
                    </Form.Group>

                </Form.Row>
            </Form>
        </Container>
        );
    }

function IncrementAge() {
    this.state.ageLimit++;
    this.setState({ageLimit: this.state.ageLimit});
}

function decrementAge() {
    if (this.state.ageLimit > 0) {
        this.state.ageLimit--;
        this.setState({ageLimit: this.state.ageLimit})
    }
}

const CustomMenu = React.forwardRef(
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