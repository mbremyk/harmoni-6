import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert, Image, Table} from "react-bootstrap";
import {EventInfo, DownloadWidget} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';
import {Event, service, Ticket, User} from '../services';
import {authService} from "../AuthService";
import {HarmoniNavbar} from "./navbar";

const jwt = require("jsonwebtoken");


export class EventPage extends Component {
    e = new Event();
    personnel = [];
    artists = [];
    isPersonnel = false;
    isOrganizer = false;
    isArtist = false;
    user = new User();

    render() {
        if (!this.e) {
            return null
        } else if (this.e) {

            if (this.isOrganizer) {
                return (
                    <div>
                    <HarmoniNavbar/>

                    <Container>

                        <Image src={this.e.imageUrl} height="auto" width="100%"/>

                        <Row>
                            <Col>
                                <h1>{this.e.eventName}</h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <a href="" download>
                                    <Button variant="primary" aria-label="Left Align" title="Last Ned">
                                        Last Ned Kontrakt
                                    </Button>
                                </a>
                            </Col>
                        </Row>

                        <Row>

                            <Col>
                                <h6>Fra {this.e.startTime} Til {this.e.endTime}</h6>
                            </Col>

                            <Col>
                                <h6>Aldersgrense {this.e.ageLimit}</h6>
                            </Col>
                            <Col>
                                <h6>Adresse: {this.e.address}</h6>
                            </Col>
                            <Col>
                                <h6>Artister: {this.artists.map(artist => (

                                    <h5>{artist.user.username}</h5>

                                ))}</h6>
                            </Col>


                        </Row>


                        <Row>
                            <Col>
                                <p>{this.e.description}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h2>Personnel</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table responsive>
                                    <thead>
                                    <tr>

                                        <th>Ansvarsområdet</th>
                                        <th>Epost</th>

                                    </tr>
                                    </thead>
                                    <tbody>

                                    {this.personnel.map(person => (
                                        <tr>
                                            <td>{person.role}</td>
                                            <td>{person.user.email}</td>


                                        </tr>

                                    ))}

                                    </tbody>


                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h2>Artister</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table responsive>
                                    <thead>
                                    <tr>

                                        <th>Navn</th>
                                        <th>Epost</th>

                                    </tr>
                                    </thead>
                                    <tbody>

                                    {this.artists.map(person => (
                                        <tr>
                                            <td>{person.user.username}</td>
                                            <td>{person.user.email}</td>


                                        </tr>

                                    ))}

                                    </tbody>


                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button href={"/endre-arrangement/" + this.props.match.params.id} variant="primary">Endre
                                    Arragement</Button>
                            </Col>
                            <Col>
                                <Button variant="danger">Avlys Arrangement</Button>
                            </Col>
                        </Row>


                    </Container>
                    </div>


                );
            } else if ((this.isArtist && this.isPersonnel || this.isArtist)) {
                return (
                    <div>
                        <HarmoniNavbar/>

                    <Container>

                        <Image src={this.e.imageUrl} height="auto" width="100%"/>

                        <Row>
                            <Col>
                                <h1>{this.e.eventName}</h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <a href="" download>
                                    <Button variant="primary" aria-label="Left Align" title="Last Ned">
                                        Last Ned Kontrakt
                                    </Button>
                                </a>
                            </Col>
                        </Row>
                        <Row>

                            <Col>
                                <h6>Fra {this.e.startTime} Til {this.e.endTime}</h6>
                            </Col>

                            <Col>
                                <h6>Aldersgrense {this.e.ageLimit}</h6>
                            </Col>
                            <Col>
                                <h6>Adresse: {this.e.address}</h6>
                            </Col>
                            <Col>
                                <h6>Artister: {this.artists.map(artist => (

                                    <h5>{artist.user.username}</h5>

                                ))}</h6>
                            </Col>


                        </Row>


                        <Row>
                            <Col>
                                <h4>{this.e.address}</h4>
                            </Col>
                        </Row>
                        <Row>

                        </Row>

                        <Row>
                            <Col>
                                <p>{this.e.description}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Table responsive>
                                <thead>
                                <tr>

                                    <th>Ansvarsområdet</th>
                                    <th>Epost</th>

                                </tr>
                                </thead>
                                <tbody>

                                {this.personnel.map(person => (
                                    <tr>
                                        <td>{person.role}</td>
                                        <td>{person.user.email}</td>


                                    </tr>

                                ))}

                                </tbody>


                            </Table>
                        </Row>

                    </Container>
                    </div>


                );
            } else if (this.isPersonnel) {
                return (
                    <div>
                    <HarmoniNavbar/>

                    <Container>

                        <Image src={this.e.imageUrl} height="auto" width="100%"/>

                        <Row>
                            <Col>
                                <h1>{this.e.eventName}</h1>
                            </Col>
                        </Row>
                        <Row>

                            <Col>
                                <h6>Fra {this.e.startTime} Til {this.e.endTime}</h6>
                            </Col>

                            <Col>
                                <h6>Aldersgrense {this.e.ageLimit}</h6>
                            </Col>
                            <Col>
                                <h6>Adresse: {this.e.address}</h6>
                            </Col>
                            <Col>
                                <h6>Artister: {this.artists.map(artist => (

                                    <h5>{artist.user.username}</h5>

                                ))}</h6>
                            </Col>


                        </Row>

                        <Row>
                            <Col>
                                <p>{this.e.description}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Table responsive>
                                <thead>
                                <tr>

                                    <th>Ansvarsområdet</th>
                                    <th>Epost</th>

                                </tr>
                                </thead>
                                <tbody>

                                {this.personnel.map(person => (
                                    <tr>
                                        <td>{person.role}</td>
                                        <td>{person.user.email}</td>


                                    </tr>

                                ))}

                                </tbody>


                            </Table>
                        </Row>


                    </Container>
                    </div>


                );


            } else if (!this.isPersonnel && !this.isOrganizer) {
                return (

                    <Container>

                        <Image src={this.e.imageUrl} height="auto" width="100%"/>

                        <Row>
                            <Col>
                                <h1>{this.e.eventName}</h1>
                            </Col>
                        </Row>
                        <Row>

                            <Col>
                                <h6>Fra {this.e.startTime} Til {this.e.endTime}</h6>
                            </Col>

                            <Col>
                                <h6>Aldersgrense {this.e.ageLimit}</h6>
                            </Col>
                            <Col>
                                <h6>Adresse: {this.e.address}</h6>
                            </Col>
                            <Col>
                                <h6>Artister: {this.artists.map(artist => (

                                    <h5>{artist.user.username}</h5>

                                ))}</h6>
                            </Col>


                        </Row>

                        <Row>
                            <Col>
                                <p>{this.e.description}</p>
                            </Col>
                        </Row>


                    </Container>


                );


            }


        }
    }

    //checks if the person viewing the event is the organizer
    mounted() {

        service
            .getEventByEventId(this.props.match.params.id)
            .then(e => {
                this.e = e;
                let token = jwt.decode(authService.getToken());
                if (this.e.organizerId == token.userId) {
                    this.isOrganizer = true;
                }
                console.log('isOrganizer: ' + this.isOrganizer);
            })
            .catch((error) => console.log(error));
        console.log('getting personnel');
        this.getPersonnelForEvent();
        console.log('getting artists');
        this.getArtistsForEvent();


    }

    //gets all the people working on that event and checks if the person viewing it is a part of the personnel
    getPersonnelForEvent() {
        service
            .getPersonnel(this.props.match.params.id)
            .then(personnel => {
                this.personnel = personnel;
                let token = jwt.decode(authService.getToken());
                this.personnel.map(person => {
                    if (person.personnelId == token.userId) {
                        this.isPersonnel = true;
                    }
                });
                console.log("Er jeg personnel? " + this.isPersonnel)
            })
            .catch((error) => console.log(error));

    }

    //gets all the artist working on that event and checks if the person viewing it is a an artist
    getArtistsForEvent() {
        service
            .getGigForEvent(this.props.match.params.id)
            .then(artists => {
                this.artists = artists;
                let token = jwt.decode(authService.getToken());
                this.artists.map(person => {
                    if (person.artistId == token.userId) {
                        this.isArtist = true;
                    }
                });
                console.log("Er jeg artist? " + this.isArtist);

            })
            .catch((error) => console.log(error));
    }


    getInfoAboutOrganizer(id) {
        service
            .getUser(id)
            .then(user => this.user = user)
            .catch((error) => console.log(error));
    }

    //only the artist viewing the page will get this option beside their contact info
    RiderButton(id) {
        let token = jwt.decode(authService.getToken());
        if (id == token.userId) {
            return <Button variant="primary" size="sm" className="float-right">Legg til Rider</Button>;
        }
    }

//returns a list over artist and their contact info if there is any artist on the event
    ShowArtist() {
        if ((this.artists.length !== 0 && (this.isArtist || this.isOrganizer))) {
            if(this.isOrganizer){
                return <div>
                    <Row>

                        <Col className="border-bottom border-top"><b>Artist</b></Col>
                        <Col className="border-bottom border-top"><b>Epost</b></Col>
                        <Col className="border-bottom border-top"><b></b></Col>
                        <Col className="border-bottom border-top"><b></b></Col>

                </Row>


                    {
                        this.artists.map(person => (
                            <Row>
                                <Col>{person.user.username}</Col>
                                <Col>{person.user.email} {this.RiderButton(person.artistId)}</Col>
                                <Col><DownloadWidget type={"kontrakt"} artist={person.artistId} event={this.currentEvent.eventId}/></Col>
                                <Col><DownloadWidget type={"rider"} artist={person.artistId} event={this.currentEvent.eventId}/></Col>
                            </Row>
                        ))}

                </div>
            }else{
                return <div>
                    <Row>

                        <Col className="border-bottom border-top"><b>Artist</b></Col>
                        <Col className="border-bottom border-top"><b>Epost</b></Col>
                        <Col className="border-bottom border-top"><b></b></Col>
                        <Col className="border-bottom border-top"><b></b></Col>
                        <Col className="border-bottom border-top"><b></b></Col>

                    </Row>


                    {
                        this.artists.map(person => (
                            <Row>
                                <Col>{person.user.username}</Col>
                                <Col>{person.user.email}</Col>
                                {this.validUser(person)}
                                <Col>{this.RiderButton(person.artistId)}</Col>
                            </Row>
                        ))}

                </div>
            }

        }
    }

    validUser(person){
        let token = jwt.decode(authService.getToken());
        console.log(token.userId+" vs "+person.artistId);
        if(person.artistId == token.userId){
            return(
                <div>
                    <Col>
                        <DownloadWidget type={"kontrakt"} artist={person.artistId} event={this.currentEvent.eventId}/>
                        <DownloadWidget type={"rider"} artist={person.artistId} event={this.currentEvent.eventId}/>
                    </Col>
                </div>
            )
        }else{
            return <div>Not worthy</div>
        }
    }


    //the button will render if the user is an artist or an organizer
    DownloadContract() {
        if (this.isOrganizer || this.isArtist) {
            return <Row>
                <Col>
                    <a href="" download>
                        <Button variant="primary" aria-label="Left Align" title="Last Ned">
                            Last Ned Kontrakt
                        </Button>
                    </a>
                </Col>
            </Row>
        }
    }

    /*DownloadContract() {
        if (!this.artists) {
            return null;
        } else {
            if (this.isOrganizer) {
                return (
                    <div>
                        {this.artists.map(artist => (
                            <Row>
                                <Col>
                                    <DownloadWidget event={this.currentEvent.eventId} type={"kontrakt"}
                                                    artist={this.artist}/>
                                </Col>
                            </Row>
                        ))};
                        <Col>
                            <DownloadWidget event={this.currentEvent.eventId} type={"annent"} artist={this.artist}/>
                        </Col>
                    </div>
                )
            } else if (this.isArtist) {
                return (
                    <div>
                        <Row>
                            <Col>
                                <DownloadWidget event={this.currentEvent.eventId} type={"kontract"}
                                                artist={this.user.userId}/>
                            </Col>
                            <Col>
                                <DownloadWidget event={this.currentEvent.eventId} type={"rider"}
                                                artist={this.user.userId}/>
                            </Col>
                        </Row>
                    </div>
                )
            }
        }
    }*/

    //only organizers get to edit the event so this button will only render when the user is the organizer
    EditButton() {
        if (this.isOrganizer) {
            return <Row>
                <Col>
                    <Button href={"/endre-arrangement/" + this.props.match.params.id} variant="primary">Endre
                        Arragement</Button>
                </Col>
                <Col>
                    <Button variant={"danger"} onClick={this.handleDelete}>Slett</Button>
                </Col>
            </Row>
        }
    }

    //renders navbar if a user is logged in
    RenderNavbar() {
        if (authService.loggedIn()) {
            return <HarmoniNavbar/>
        }
    }

    RenderArtist() {
        if (this.artists.length !== 0) {
            return <Col>
                <h6>Artister: {this.artists.map(artist => (

                    <h5>{artist.user.username}</h5>

                ))}</h6>
            </Col>
        }

    }

    RenderAgeLimit() {
        if (this.currentEvent.ageLimit !== 0) {
            return <Col>
                <h6>Aldersgrense {this.currentEvent.ageLimit}</h6>
            </Col>

        } else {
            return <Col>
                <h6>Tillat for alle</h6>
            </Col>
        }


    }

    handleDelete = () => {
        if (window.confirm("Er du sikker på at du vil slette arrangementet? \nDette kan ikke angres")) {
            service.deleteEvent(this.currentEvent).then(() => {this.props.history.push("/hjem/")});
            alert("Arrangementet er nå slettet")
        }
    };

}