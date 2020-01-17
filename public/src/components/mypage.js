import * as React from 'react';
import {Component} from "react-simplified";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {service, User} from "../services";
import {authService} from "../AuthService";
import {HarmoniNavbar} from "./navbar";
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
            password2: '',
            oldUsername: '',
            oldEmail: ''
        }
    }
    render() {
        return (
            <div>
                <HarmoniNavbar/>
                <Container>
                    <Form>
                        <h1>Min side</h1>
                        <Form.Group>
                            <Form.Label>Brukernavn</Form.Label>
                            <Form.Control autocomplete="username" value={this.state.username}
                                      onChange={this.handleUsernameChange}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>E-post</Form.Label>
                            <Form.Control autocomplete="email" value={this.state.email} onChange={this.handleEmailChange}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formNewPassword">
                            <Form.Label>Nytt passord</Form.Label>
                            <Form.Control autocomplete="new-password" type="password" placeholder="Nytt passord"
                                      value={this.state.password1} onChange={this.handleNewPassword1Change}/>
                        </Form.Group>
                        <Form.Group controlId="formRepNewPassword">
                            <Form.Label>Gjenta nytt passord</Form.Label>
                            <Form.Control autocomplete="new-password" type="password" placeholder="Gjenta nytt passord"
                                      value={this.state.password2} onChange={this.handleNewPassword2Change}/>
                        </Form.Group>
                        <Button variant="primary" type="button" onClick={this.save}>
                            Lagre
                        </Button>
                    </Form>
                </Container>
            </div>
        );
    }

    mounted() {
        if (authService.loggedIn()) {
            let user = new User();
            service.getUser(jwt.decode(authService.getToken()).userId)
                .then(u => {
                    user.email = u.email;
                    user.username = u.username;
                    this.setState({
                        username: u.username,
                        email: u.email,
                        userId: u.userId,
                        oldEmail: u.email,
                        oldUsername: u.username
                    });
                })
                .catch(err => alert("En feil har oppstått: " + err.message));
        } else {
            console.log("Not logged in");
            this.props.history.push('/logg-inn');
        }
    }

    save() {
        let user = new User();
        user.email = this.state.email;
        user.username = this.state.username;
        user.userId = this.state.userId;

        if (this.state.password1 != this.state.password2) {
            alert("Passordene er ulike.");
            return;
        }
        //Update password
        if (this.state.password1 != "" && this.state.password1 === this.state.password2) {
            user.password = this.state.password1;
            service.updatePassword(user)
                .then(res => console.log("Password updated" + res))
                .then(alert("Passord oppdatert."))
                .then(this.state.password1 = "")
                .then(this.state.password2 = "")
                .catch(err => alert("En feil har oppstått: " + err.message));
        }
        //Update username
        if (user.username != this.state.oldUsername && user.email == this.state.oldEmail) {
            service.validateUsername(user.username).then(taken1 => {
                console.log('Check username, taken: ' + taken1);
                if (taken1) {
                    alert('Brukernavn er i bruk :(');
                } else {
                    service.updateUser(user)
                        .then(res => console.log("User updated: " + res + " Password: " + user.password + " test"))
                        .then(alert('Brukernavn oppdatert.'))
                        .then(window.location.reload())
                        .catch(err => alert("En feil har oppståt: t" + err.message));
                }
            });
            //Update email
        } else if (user.username == this.state.oldUsername && user.email != this.state.oldEmail) {
            service.validateEmail(user.email).then(taken2 => {
                console.log('Check email, taken: ' + taken2);
                if (taken2) {
                    alert('Epost er i bruk');
                } else {
                    service.updateUser(user)
                        .then(res => console.log("User updated: " + res))
                        .then(alert('E-post oppdatert.'))
                        .then(window.location.reload())
                        .catch(err => alert("En feil har oppståt: t" + err.message));
                }
            });
            //update username and email
        } else if (user.username != this.state.oldUsername && user.email != this.state.oldEmail) {
            service.validateUsername(user.username).then(taken1 => {
                console.log('Check username, taken: ' + taken1);
                if (taken1) {
                    alert('Brukernavn er i bruk :(');
                } else {
                    // check email availability
                    service.validateEmail(user.email).then(taken2 => {
                        console.log('Check email, taken: ' + taken2);
                        if (taken2) {
                            alert('Epost er i bruk');
                        } else {
                            service.updateUser(user)
                                .then(res => console.log("User updated: " + res))
                                .then(alert('Brukernavn og e-post oppdatert.'))
                                .then(window.location.reload())
                                .catch(err => alert("En feil har oppståt: t" + err.message));
                        }
                    })
                }
            });
        } else {
            window.location.reload();
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
