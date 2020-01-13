import * as React from 'react';
import {Component} from "react-simplified";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Services} from "../services";


/*
* My page container for "/min-side". Ability to change name, email and password for a logged in user.
 */
export class myPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "Navn Navnesen",
            email: "epost@epost.no",
            password: "",
            newpass: "",
            repnewpass: ""
        }
    }
    render() {
        return(
            <Container>
                <Form>
                    <h1>Min side</h1>
                    <Form.Group>
                        <Form.Label column={}>Navn</Form.Label>
                        <Form.Control autocomplete="username" value={this.state.username} onChange={this.handleUsernameChange}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label column={}>E-post</Form.Label>
                        <Form.Control autocomplete="email" value={this.state.email} onChange={this.handleEmailChange}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label column={}>Passord</Form.Label>
                        <text className="text-danger"> *</text>
                        <Form.Control autocomplete="current-password"  type="password" autocom placeholder="Passord" value={this.state.password} onChange={this.handlePasswordChange}  />
                    </Form.Group>
                    <Form.Group controlId="formNewPassword">
                        <Form.Label column={}>Nytt passord</Form.Label>
                        <Form.Control autocomplete="new-password" type="password" placeholder="Nytt passord" value={this.state.newpass} onChange={this.handleNewPasswordChange} />
                    </Form.Group>
                    <Form.Group controlId="formRepNewPassword">
                        <Form.Label column={}>Gjenta nytt passord</Form.Label>
                        <Form.Control autocomplete="new-password" type="password" placeholder="Gjenta nytt passord" value={this.state.repnewpass} onChange={this.handleRepNewPasswordChange}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={this.save}>
                        Lagre
                    </Button>
                </Form>
            </Container>
        );
    }
    mounted() {
    }
    save() {
        if (this.state.password === "123") {
            if (this.state.newpass === "" && this.state.repnewpass === "") {
                alert("Saved. Name: " + this.state.name + " Email: " + this.state.email);
            } else if (this.state.newpass === this.state.repnewpass) {
                alert("password changed to: " + this.state.newpass);
            }
        }
    }
    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }
    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }
    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }
    handleNewPasswordChange(event) {
        this.setState({newpass: event.target.value});
    }
    handleRepNewPasswordChange(event) {
        this.setState({repnewpass: event.target.value});
    }
}
