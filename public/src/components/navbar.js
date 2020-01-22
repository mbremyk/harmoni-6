import * as React from 'react';
import {Component} from "react-simplified";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import NavLink from "react-bootstrap/NavLink";
import NavDropdown from "react-bootstrap/NavDropdown";

export class HarmoniNavbar extends Component {
    state = {
        input: ''
    };

    handleInputChange(event) {
        this.setState({input: event.target.value});
    }

    render() {
        return (
            <Navbar bg="light" expand="lg">
                <NavLink href="/hjem"><h1 className="HarmoniLogo display-5 text-center text-body">Harmoni</h1></NavLink>
                <Navbar.Toggle aria-controls="basic-harmoniNavbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/hjem">Hjem</Nav.Link>
                        <NavDropdown title="Arrangementer" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/hjem/#arrangementer-jeg-organiserer">Arrangementer jeg organiserer</NavDropdown.Item>
                            <NavDropdown.Item href="/hjem/#arrangementer-jeg-er-artist-eller-er-personell-for">Arrangementer jeg er artist eller er personell for</NavDropdown.Item>
                            <NavDropdown.Item href="/hjem/#andre-arrangementer">Andre arrangementer</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/opprett-arrangement">Opprett arrangement</Nav.Link>
                        <Nav.Link href="/min-side">Min side</Nav.Link>
                        <Nav.Link href="/logg-ut">Logg ut</Nav.Link>
                    </Nav>
                    <Form inline onSubmit={this.search}>
                        <FormControl type="text"
                                     placeholder="Søk"
                                     className="mr-sm-2"
                                     value={this.state.input}
                                     onChange={this.handleInputChange}

                                     />
                        <Button variant="outline-success" onClick={this.search}>Søk</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    search(event) {
        event.preventDefault();
        window.location = ("/sok/" + this.state.input);
    }
}