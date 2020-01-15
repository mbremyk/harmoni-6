import * as React from 'react';
import {Component} from "react-simplified";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

export class HarmoniNavbar extends Component {
    state = {
        input: ''
    };

    handleInputChange(event) {
        this.setState({input: event.target.value});
    }

    render() {
        return (
            <div>
                <Navbar bg="light">
                    <Navbar.Brand href="/hjem">
                        Harmoni
                    </Navbar.Brand>
                </Navbar>
                <Navbar bg="light" expand="lg">
                    <Navbar.Toggle aria-controls="basic-harmoniNavbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/hjem">Hjem</Nav.Link>
                            <Nav.Link href="/opprett-arrangement">Opprett arrangement</Nav.Link>
                            <Nav.Link href="/min-side">Min side</Nav.Link>
                            <Nav.Link href="/logg-ut">Logg ut</Nav.Link>
                        </Nav>
                        <Form inline>
                            <FormControl type="text"
                                         placeholder="Søk"
                                         className="mr-sm-2"
                                         value={this.state.input}
                                         onChange={this.handleInputChange}
                                         onKeyPress={(event) => {
                                             if (event.key === "Enter") {
                                                 alert("Search clicked, input: " + this.state.input + "\n Kun knappen fungerer TODO");
                                                 this.search()
                                             }
                                         }}/>
                            <Button variant="outline-success" onClick={this.search}>Søk</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }

    search() {
        //let url = "/sok/" + this.state.input;
        //alert("Search clicked, input: " + this.state.input + "\n Bruk knappen! Fuck js...");
        window.location = ("/sok/" + this.state.input);
        //window.location.replace("https://www.w3schools.com");
        //this.props.history.push("/sok/" + this.state.input);
        return false;
    }
}