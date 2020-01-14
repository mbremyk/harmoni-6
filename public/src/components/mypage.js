import * as React from 'react';
import {Component} from "react-simplified";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {service} from "../services";
import {authService} from "../AuthService";
import * as jwt from "jsonwebtoken";

/*
* My page container for "/min-side". Ability to change name, email and password for a logged in user.
 */
export class myPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            newemail: '',
            newpass: '',
            repnewpass: ''
        }
    }
    render() {
        return(
            <div>
                <Container>
                    <Form>
                        <h1>Min side</h1>
                        <Form.Group>
                            <Form.Label>Navn</Form.Label>
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
                            <Form.Control autocomplete="new-password" type="password" placeholder="Nytt passord" value={this.state.newpass} onChange={this.handleNewPasswordChange} />
                        </Form.Group>
                        <Form.Group controlId="formRepNewPassword">
                            <Form.Label>Gjenta nytt passord</Form.Label>
                            <Form.Control autocomplete="new-password" type="password" placeholder="Gjenta nytt passord" value={this.state.repnewpass} onChange={this.handleRepNewPasswordChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={this.save}>
                            Lagre
                        </Button>
                    </Form>
                </Container>
            </div>
        );
    }
    mounted() {
        if(authService.loggedIn()) {
            console.log("I am logged in");
            let token = jwt.decode(authService.getToken());
            this.setState({
                username: token.username,
                email: token.email
            });
            console.log(jwt.decode(authService.getToken()));
        } else {
            console.log("Not logged in");
            this.props.history.push('/logg-inn');
        }

    }
    save() {
        if (this.state.newpass === "" && this.state.repnewpass === "") {
            alert("Saved. Name: " + this.state.name + " Email: " + this.state.email);
        } else if (this.state.newpass === this.state.repnewpass) {
                alert("password changed to: " + this.state.newpass);
            }
        service.getUser(authService.getToken().id)
    }
    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }
    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }
    handleNewPasswordChange(event) {
        this.setState({newpass: event.target.value});
    }
    handleRepNewPasswordChange(event) {
        this.setState({repnewpass: event.target.value});
    }
}
