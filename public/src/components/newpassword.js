import {Component} from "react-simplified";
import * as React from "react";
import {Card} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {service} from '../services';

const jwt = require("jsonwebtoken");

export class NewPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			error: '',
			errorType: 'success',
		};
		this.handleEmailChange = this.handleEmailChange.bind(this);
	}

	handleEmailChange(event) {
		this.setState({email: event.target.value});
	}

	setError(message, variant) {
		this.setState({error: message, errorType: variant});
		setTimeout( () => this.setState({error: '', errorType: 'primary'}), 5000);
	}

	handleNewPassword() {
		console.log('REQUEST NEW PASS');

		if(!this.state.email) {
			this.setError('Fyll ut email', 'danger');
			return;
		}

		service.forgotPass(this.state.email)
			.then(res => console.log('res ' + res))
			.then(res => this.setError('Email sendt.', 'success'))
			.catch(err => this.setError('Email sendt.', 'success'));
	}

	render() {
		return(
			<Container className={"c-sm"} style={{top: '0' , paddingBottom: '15em'}}>

				<h1 className="HarmoniLogo display-sm-3 text-center m-5">Harmoni</h1>

				<Card className="m-sm-5" style={{padding: '10px'}}>
					<div style={{padding: '5%'}}>

						<h1 className='h1 text-center'>Glemt passord</h1>

						{(this.state.error)?
							<Alert style={{height: '3em'}} variant={this.state.errorType}>{this.state.error}</Alert> :
							<div style={{height: '3em'}}/>}

						<Form>
							<Form.Group controlId="formBasicEmail">
								<Form.Label>Email</Form.Label>
								<Form.Control
									type="email"
									placeholder="Skriv inn email"
									value={this.state.email}
									onChange={this.handleEmailChange}/>
							</Form.Group>

							<Button
								className="mr-2"
								onClick={this.handleNewPassword}
								variant="primary"
								type="button">
								Send nytt passord
							</Button>
							<Button
								href="/logg-inn"
								variant="secondary"
								type="button">
								Avbryt
							</Button>
						</Form>
					</div>
				</Card>
			</Container>
		)
	}
}