import {Component} from "react-simplified";
import * as React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import NavLink from "react-bootstrap/NavLink";


export class LoginForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }
    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    render(){
        return(
            <Container>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Skriv inn email" value={this.state.email} onChange={this.handleEmailChange} />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Passord</Form.Label>
                        <Form.Control type="password" placeholder="Skriv inn passord" value={this.state.password} onChange={this.handlePasswordChange} />
                    </Form.Group>

                    <Button onClick={() => alert("Email: " + this.state.email + " Password: " + this.state.password)} variant="primary" type="submit">
                        Login
                    </Button>
                    <NavLink href={'/nybruker'}>Opprett bruker her!</NavLink>
                </Form>
            </Container>
        );
    }

    hashPassword(){
        return this.state.password
    }





}

