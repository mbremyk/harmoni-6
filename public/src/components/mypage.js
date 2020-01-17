import * as React from 'react';
import {Component} from "react-simplified";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {service, User} from "../services";
import {authService} from "../AuthService";
import {HarmoniNavbar} from "./navbar";
import * as jwt from "jsonwebtoken";
import Alert from "react-bootstrap/Alert";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import {Card} from "react-bootstrap";

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
            oldEmail: '',
            error: '',
            errorType: 'success',
        }
    }

    setError(message, variant) {
        this.setState({error: message, errorType: variant});
        setTimeout( () => this.setState({error: '', errorType: 'primary'}), 5000);
    }

    render() {
        return (
            <div>
                <HarmoniNavbar/>

                <Container style={{width: '40em'}}>
                    <Card style={{padding: '10px', marginTop: '10%'}}>
                        <div style={{padding: '5%'}}>
                            <label className='h1'>Min side</label>

                            {(this.state.error)?
                                <Alert style={{height: '3em'}} variant={this.state.errorType}>{this.state.error}</Alert> :
                                <div style={{height: '3em'}}/>}

                            <Form>
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

                                <PasswordStrengthMeter password={this.state.password1}/>

                                <Form.Group controlId="formRepNewPassword">
                                    <Form.Label>Gjenta nytt passord</Form.Label>
                                    <Form.Control autocomplete="new-password" type="password" placeholder="Gjenta nytt passord"
                                              value={this.state.password2} onChange={this.handleNewPassword2Change}/>
                                </Form.Group>
                                <Button variant="primary" type="button" onClick={this.save}>
                                    Lagre
                                </Button>
                            </Form>
                        </div>
                    </Card>
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

    async save() {

        if(!this.state.email || !this.state.username) {
            this.setError('Alle felter må fylles', 'danger');
            return;
        }

        if(this.state.password1 !== this.state.password2) {
            this.setError('Passordene må være like', 'danger');
            return;
        }

        if(!!this.state.password1){
            if (this.state.password1.length < 5) {
                this.setError('Passord må inneholde minst 5 tegn', 'danger');
                return;
            }
        }

        if(this.state.oldEmail !== this.state.email) {
            let taken1 = await service.validateEmail(this.state.email);

            if(taken1) {
                this.setError('Epost ikke tilgjengelig', 'danger');
                return;
            }
        }

        if(this.state.oldUsername !== this.state.username) {
            let taken2 = await service.validateUsername(this.state.username);

            if(taken2) {
                this.setError('Brukernavn ikke tilgjengelig', 'danger');
                return;
            }
        }

        let user = new User();
        user.userId = this.state.userId;
        user.username = this.state.username;
        user.email = this.state.email;
        user.password = this.state.password1;

        service.updateUser(user).then(res => {
            console.log(res);
            this.setError('Bruker oppdatert!', 'success');
            this.setState({password1: '', password2: ''});
            this.setState({oldUsername: user.username, oldEmail: user.email});
        }). catch(err => {
            console.log(err);
            this.setError('Kunne ikke oppdatere bruker', 'danger');
            this.setState({username: this.state.oldUsername, email: this.state.oldEmail});
        });
    }

    // Gammel metode
    /*save() {
        let user = new User();
        user.email = this.state.email;
        user.username = this.state.username;
        user.userId = this.state.userId;

        if (this.state.password1 !== this.state.password2) {
            this.setError("Passordene er ulike.", 'danger');
            return;
        }
        //Update password
        if (this.state.password1 !== "" && this.state.password1 === this.state.password2) {
            user.password = this.state.password1;
            service.updatePassword(user)
                .then(res => console.log("Password updated" + res))
                .then(this.setError("Passord oppdatert.", 'success'))
                .then(this.state.password1 = "")
                .then(this.state.password2 = "")
                .catch(err => this.setError("En feil har oppstått", 'danger'));
        }
        //Update username
        if (user.username !== this.state.oldUsername && user.email === this.state.oldEmail) {
            service.validateUsername(user.username).then(taken1 => {
                console.log('Check username, taken: ' + taken1);
                if (taken1) {
                    this.setError('Brukernavn er i bruk :(', 'danger');
                } else {
                    service.updateUser(user)
                        .then(res => console.log("User updated: " + res + " Password: " + user.password + " test"))
                        .then(window.location.reload())
                        .then(this.setError('Brukernavn oppdatert.', 'success'))
                        .catch(err => this.setError("En feil har oppståt", 'danger'));
                }
            });
            //Update email
        } else if (user.username === this.state.oldUsername && user.email !== this.state.oldEmail) {
            service.validateEmail(user.email).then(taken2 => {
                console.log('Check email, taken: ' + taken2);
                if (taken2) {
                    this.setError('Epost er i bruk','danger');
                } else {
                    service.updateUser(user)
                        .then(res => console.log("User updated: " + res))
                        .then(window.location.reload())
                        .then(this.setError('E-post oppdatert.', 'success'))
                        .catch(err => this.setError("En feil har oppståt", 'danger'));
                }
            });
            //update username and email
        } else if (user.username !== this.state.oldUsername && user.email !== this.state.oldEmail) {
            service.validateUsername(user.username).then(taken1 => {
                console.log('Check username, taken: ' + taken1);
                if (taken1) {
                    this.setError('Brukernavn er i bruk :(', 'danger');
                } else {
                    // check email availability
                    service.validateEmail(user.email).then(taken2 => {
                        console.log('Check email, taken: ' + taken2);
                        if (taken2) {
                            this.setError('Epost er i bruk', 'danger');
                        } else {
                            service.updateUser(user)
                                .then(res => console.log("User updated: " + res))
                                .then(window.location.reload())
                                .then(this.setError('Brukernavn og e-post oppdatert.', 'success'))
                                .catch(err => this.setError("En feil har oppståt", 'danger'));
                        }
                    })
                }
            });
        } else {
            window.location.reload();
        }
    }*/

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
