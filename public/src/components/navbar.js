import * as React from 'react';
import {Component} from "react-simplified";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

export class HarmoniNavbar extends Component {
    render() {
        return (
            <div>
                <Navbar bg="light">
                    <Navbar.Brand href="/">
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
                            <FormControl type="text" placeholder="Søk" className="mr-sm-2" onKeyPress={event => {
                                if (event.key === "Enter") {
                                    this.search();
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
        alert("Search clicked");
    }
}