import {Component} from "react-simplified";
import * as React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import NavLink from "react-bootstrap/NavLink";
import {encrypt} from "../encryption"
import {service, User} from "../services";
import { createHashHistory } from 'history';

export class CreateUserForm extends Component{
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			email: '',
			password1: '',
			password2: '',
			salt: '',
			hash: '',
		};
		this.handleEmailChange     = this.handleEmailChange.bind(this);
		this.handleUsernameChange  = this.handleUsernameChange.bind(this);
		this.handlePassword1Change = this.handlePassword1Change.bind(this);
		this.handlePassword2Change = this.handlePassword2Change.bind(this);
	}

	handleUsernameChange(event) {
		this.setState({username: event.target.value});
	}
	handleEmailChange(event) {
		this.setState({email: event.target.value});
	}
	handlePassword1Change(event) {
		this.setState({password1: event.target.value});
	}
	handlePassword2Change(event) {
		this.setState({password2: event.target.value});
	}
	handleSubmit() {
		console.log('handle Submit user');
		if(this.state.password1 != this.state.password2) {
			alert('Passordene stemmer ikke');
			return;
		}
		// async encrypt promise
		encrypt(this.state.password1)
			.then(credentials => this.submit(credentials))
			.catch(err => alert("En feil oppsto."));
	}
	submit(credentials) {
		console.log('Submit user' + credentials);
		let user      = new User();
		user.email    = this.state.email;
		user.username = this.state.username;
		user.password = credentials[0];
		user.salt     = credentials[1];

		alert('Hash and salt\n' + credentials[0] + '\n' + credentials[1]);
		return;

		service.createUser(user)
			.then(res => console.log('Submit user status: ' + res))
			.catch(err => alert("En feil oppsto."));
	}
	cancel() {
		console.log('Canceled create user');
		alert('Canceled');
		//history.push('/logginn');
		// test i chrome/firefox, mulige problemer med Brave
	}

	render(){
		return(
			<Container>
				<Form>
					<Form.Group controlId="formBasicUsername">
						<Form.Label>Brukernavn</Form.Label>
						<Form.Control type="username" placeholder="Skriv inn brukernavn" value={this.state.username} onChange={this.handleUsernameChange} />
					</Form.Group>
					<Form.Group controlId="formBasicEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" placeholder="Skriv inn email" value={this.state.email} onChange={this.handleEmailChange} />
					</Form.Group>
					<Form.Group controlId="formBasicPassword1">
						<Form.Label>Passord</Form.Label>
						<Form.Control type="password" placeholder="Skriv inn passord" value={this.state.password1} onChange={this.handlePassword1Change} />
					</Form.Group>
					<Form.Group controlId="formBasicPassword2">
						<Form.Label>Gjenta passord</Form.Label>
						<Form.Control type="password" placeholder="Gjenta passord" value={this.state.password2} onChange={this.handlePassword2Change} />
					</Form.Group>

					<Button onClick={this.handleSubmit} variant="primary" type="button">
						Opprett bruker
					</Button>
					<Button onClick={this.cancel} variant="secondary" type="button">
						Avbryt
					</Button>
				</Form>
			</Container>
		);
	}
}

