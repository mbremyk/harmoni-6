import * as React from 'react';
import {Component} from "react-simplified";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {service, User} from "../services";
import {authService} from "../AuthService";
import * as jwt from "jsonwebtoken";



/*
* My page container for "/min-side". Ability to change name, email and password for a logged in user.
 */
export class myPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            username: '',
            email: '',
            password1: '',
            password2: ''
        }
    }
    render() {
        return(
            <Container>
                <Form>
                    <h1>Min side</h1>
                    <Form.Group>
                        <Form.Label>Brukernavn</Form.Label>
                        <Form.Control autocomplete="username" value={this.state.username} onChange={this.handleUsernameChange}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>E-post</Form.Label>
                        <Form.Control autocomplete="email" value={this.state.email} onChange={this.handleEmailChange}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formNewPassword">
                        <Form.Label>Nytt passord</Form.Label>
                        <Form.Control autocomplete="new-password" type="password" placeholder="Nytt passord" value={this.state.password1} onChange={this.handleNewPassword1Change} />
                    </Form.Group>
                    <Form.Group controlId="formRepNewPassword">
                        <Form.Label>Gjenta nytt passord</Form.Label>
                        <Form.Control autocomplete="new-password" type="password" placeholder="Gjenta nytt passord" value={this.state.password2} onChange={this.handleNewPassword2Change}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={this.save}>
                        Lagre
                    </Button>
                </Form>
            </Container>
        );
    }
    mounted() {
        if(authService.loggedIn()) {
            let user = new User();
            service.getUser(jwt.decode(authService.getToken()).userId)
                .then(u => {
                    user.email = u.email;
                    user.username = u.username;
                    this.setState({
                        username: u.username,
                        email: u.email,
                        userId: u.userId
                    });
                })
                .catch(err => alert("En feil har oppstått: " + err.message));
        } else {
            console.log("Not logged in");
            this.props.history.push('/logg-inn');
        }

    }
    save() {
        let user      = new User();
        user.email    = this.state.email;
        user.username = this.state.username;
        user.userId   = this.state.userId;

        if (this.state.password1 != this.state.password2) {
            alert("Passordene er ulike.");
            return;
        }
        if (this.state.password1 == "") {
            service.updateUser(user)
                .then(res => console.log("User updated: " + res))
                .catch(err => alert("En feil har oppståt: t" + err.message));
            alert("Bruker oppdatert. Ny epost: " + user.email + ". Nytt brukernavn: " + user.username);
            return;
        }
    }
    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }
    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }
    handleNewPassword1Change(event) {
        this.setState({password1: event.target.value});
    }
    handleNewPassword2Change(event) {
        this.setState({password2: event.target.value});
    }
}
