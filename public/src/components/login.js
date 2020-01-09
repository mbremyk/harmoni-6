import {Component} from "react-simplified";
import * as React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import NavLink from "react-bootstrap/NavLink";
import {service} from "../services";
import {hashPassword} from "../userhandling";

export class LoginForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);

    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }
    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }
    handleLogin() {

        // get salt
        service.getSalt(this.state.email)

            // hash password with salt
            .then(salt => hashPassword(this.state.password, salt))

                // get access token
                .then(credentials => service.login(this.state.email, credentials[0]))

                    // set local token and login
                    .then(token => this.login(token))

                    .catch(err => alert("En feil oppsto. token"))
                .catch(err => alert("En feil oppsto. hash"))
            .catch(err => alert("En feil oppsto. salt"))
    }

    login(token) {
        window.localStorage.setItem('token', token)
    }

    getAccessToken(){
        return service.getAccessToken(this.state.email)
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
                    <NavLink href={'/ny-bruker'}>Opprett bruker her!</NavLink>
                </Form>
            </Container>
        );
    }



}

