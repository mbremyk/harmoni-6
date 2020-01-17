import {service, Event, Personnel, SimpleFile, BulkGig, BulkPersonnel} from "../services";
import {Component} from "react-simplified";
import {HarmoniNavbar} from "./navbar";
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
import {authService} from "../AuthService";
import Row from "react-bootstrap/Row";
import {useRouteMatch} from "react-router";
const jwt = require("jsonwebtoken");

//TODO: Sjekke om artist er allerede lagt inn
//TODO: Legge til annet personell
//TODO: Legge til bilde

export default function NewAndUpdateEvent() {

    let match = useRouteMatch();

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
    const [personnelRole, setPersonnelRole] = useState("");
    const [cancelled, setCancelled] = useState(0);

    useEffect(() => {

        console.log(match);

        if (match.path === "/opprett-arrangement") {
            setupNew()
        }

        if (match.path === "/endre-arrangement/:id") {
            setupUpdate()
        }
    }, []);

    function setupUpdate() {
        console.log("endrer arragngement")

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
            setFDate(fromDate);
            setFTime(fromTime);
            setTDate(toDate);
            setTTime(toTime);
            setImageUrl(event.imageUrl);
            setImage(event.image);
            setCancelled(event.cancelled);

            service.getUsers().then(users => setArtists(users)).catch((err) => console.log(err.message));
            service.getPersonnel(match.params.id).then(personnel => setPersonnelAdd(personnel)).catch((err) => console.log(err.message));
            service.getGigForEvent(match.params.id).then(g => {
                g.map(u =>
                    service.getUser(u.artistId).then((user) => setArtistsAdd(artistsAdd.concat(user)))
                        .catch((err) => console.log(err.message)))
            })
        }).catch((error) => console.log(error.message));
    }

    function setupNew() {

        console.log("oppretter event");

        let token = authService.getToken();
        let decoded = jwt.decode(token);
        let uId = decoded.userId;
        setOrganizerId(uId)
        service.getUsers().then(users => setArtists(users)).catch((err) => alert(err.message));
    }

    function handleSubmit() {

        if (match.path === "/endre-arrangement/:id") {
            sumbitUpdate();
        }

        if (match.path === "/opprett-arrangement") {
            sumbitNew();
        }
    }

    function sumbitNew() {

        let fDateTime = fDate + " " + fTime + ":00";
        let tDateTime = tDate + " " + tTime + ":00";

        let e = new Event(0, organizerId, eventName, eventAddress, eventDescription, ageLimit,
            fDateTime, tDateTime, imageUrl, image);

        toBase64(contract)
            .then(cData => {
                toBase64(rider)
                    .then(rData => {
                            let contract = new SimpleFile(cData, contract.name);
                            let rider = new SimpleFile(rData, rider.name);
                            console.log(contract);

                            service.createEvent(e).then(updated => {
                                    service.createGig(new BulkGig(updated.insertId, artistsAdd, contract, rider)).then(() =>
                                        service.createPersonnel(new BulkPersonnel(personnelAdd, updated.insertId)
                                            .then(() => window.location = "/opprett-arrangement/" + updated.insertId)));
                                }
                            ).catch(err => alert(err.message));
                        }
                    )
            });
    }

    function sumbitUpdate() {

        let fDateTime = fDate + " " + fTime + ":00";
        let tDateTime = tDate + " " + tTime + ":00";

        let e = new Event(eventId, organizerId, eventName, eventAddress,
            eventDescription, ageLimit, fDateTime, tDateTime, imageUrl, image, cancelled);

        service.updateEvent(e).then(window.location = "/arrangement/" + eventId);
    }

    function toBase64(file) {
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    //if(!(Array.isArray(artists) && artists.length)) return null;

        return(
            <div>
	            <HarmoniNavbar/>
                <Container>
                    <Form>
                        <Form.Row>

                        <Form.Group as={Col} sm={"12"}>
                            {(match.url === "/opprett-arrangement") ?
                                <h1 className="font-weight-bold text-center">Opprett arrangement</h1> :
                                <h1 className="font-weight-bold text-center">Endre arrangement</h1>}
                        </Form.Group>

                        <Form.Group as={Col} sm={"12"}>
                            <Form.Label>Arrangementsnavn</Form.Label>
                            <Form.Control
                                placeholder="Navn på arrangement"
                                value={eventName}
                                onChange={event => setEventName(event.target.value)}
                            />
                        </Form.Group>

                        <Form.Group as={Col} sm={"12"}>
                            <Form.Label>Adresse</Form.Label>
                            <Form.Control
                                placeholder="Adresse der arrangementet skal holdes"
                                value={eventAddress}
                                onChange={event => setEventAddress(event.target.value)}

                            />
                        </Form.Group>

                        <Form.Group as={Col} sm={12}>
                            <Form.Label>Beskrivelse</Form.Label>
                            <Form.Control
                                placeholder="Her kan du skrive en beskrivelse av arrangementet"
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

                                <Dropdown onSelect={event => service.getUser(event).then((user) => {
                                    setArtistsAdd(artistsAdd.concat(user))
                                })}>

                                    <Dropdown.Toggle variant={"success"} id="dropdown">
                                        Velg artist
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu style={{overflowY: 'scroll', maxHeight: "300px"}} as={CustomMenu}>
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
                                                    <Row>
                                                        <Col>
                                                            {artist.username}
                                                        </Col>

                                                        <Col>
                                                            <Button type="button" variant={"danger"} onClick={() => {
                                                                let copy = [...artistsAdd];
                                                                copy.splice(artistsAdd.indexOf(artist), 1);
                                                                setArtistsAdd(copy);
                                                            }
                                                            }>Fjern</Button>
                                                        </Col>
                                                    </Row>
                                            </ListGroupItem>
                                        </React.Fragment>
                                ))}
                            </ListGroup>

                            </Form.Group>

                            <Form.Group as={Col} sm={"2"}>

                            <Form.Label>Personell</Form.Label>

                                <Dropdown onSelect={event => service.getUser(event).then((user) =>
                                    setPersonnelAdd(personnelAdd.concat(user)))}>

                                <Dropdown.Toggle variant={"success"} id="dropdown">
                                    Velg personell
                                </Dropdown.Toggle>

                                    <Dropdown.Menu style={{overflowY: 'scroll', maxHeight: "300px"}} as={CustomMenu}>
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
                                            <Row>
                                                <Col>
                                                    {personnel.username}
                                                </Col>

                                                <Col>
                                                    <Form.Control
                                                        placeholder="Rollen til personen"
                                                        value={personnel.role}
                                                        onChange={event => {
                                                            setPersonnelRole(event);
                                                            personnel.role = event.target.value
                                                        }}
                                                    />
                                                </Col>

                                                <Col>
                                                    <Button type="button" variant={"danger"} onClick={() => {
                                                        let copy = [...personnelAdd];
                                                        copy.splice(personnelAdd.indexOf(personnel), 1);
                                                        setPersonnelAdd(copy)
                                                    }
                                                    }>
                                                        Fjern
                                                    </Button>
                                                </Col>
                                            </Row>
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
                                    value={image}
                                    onChange={event => setImage(event.target.value)}
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
                            <label>Last opp rider</label>
                            <input type="file" className="form-control" encType="multipart/form-data" name="file"
                                   onChange={event => setRider(event.target.files[0])}/>
                        </Form.Group>

                        <Form.Group as={Col} sm={"6"}>
                            <label>Last opp kontrakt</label>
                            <input type="file" className="form-control" encType="multipart/form-data" name="file"
                                   onChange={event => setContract(event.target.files[0])}/>
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

                            <Row>

                                <Col>
                                    <Button type="button" variant={"success"} onClick={handleSubmit}>Opprett
                                        arrangementet</Button>
                                </Col>

                                <Col>
                                    <Button variant={"danger"} type="button" onClick={() => {
                                        if (window.confirm("Ønsker du å avlyse arrangementet?")) setCancelled(true)
                                    }}>Avlys arrangement</Button>
                                </Col>

                                <Col>
                                    <Button id={"contract"} onClick={downloadC}>Download the contract</Button>
                                </Col>

                                <Col>
                                    <Button id={"rider"} onClick={downloadR}>Download the rider</Button>
                                </Col>
                            </Row>
                        </Form.Row>
                    </Form>
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

    function downloadC(e) {
        //For the time being this only fetches the file with the 1-1 key.
        //window.location.href="http://localhost:5001/harmoni-6/us-central1/webApi/api/v1/contract/1/1";
        let eventId = eventId;
        let artistId = artists[0].userId;
        console.log(artists[0].username);
        if (e.target.id == "contract") {
            service.downloadContract(eventId, artistId)
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

    function downloadR(e) {
        //For the time being this only fetches the file with the 1-1 key.
        //window.location.href="http://localhost:5001/harmoni-6/us-central1/webApi/api/v1/contract/1/1";
        let eventId = eventId;
        let artistId = artists[0].userId;
        console.log(artists[0].username);
        service.downloadRider(eventId, artistId)
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

const CustomMenu = React.forwardRef(
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
