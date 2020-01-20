import {Component} from "react-simplified";
import * as React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {service, User} from "../services";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import {Card} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

export class CreateUserForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			email: '',
			password1: '',
			password2: '',
			salt: '',
			hash: '',
            error: '',
            errorType: 'success',
		};
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
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

    setError(message, variant) {
        this.setState({error: message, errorType: variant});
        setTimeout(() => this.setState({error: '', errorType: 'primary'}), 5000);
    }


	handleSubmit() {
		console.log('handle Submit user');

		// check empty fields
        if (!this.state.username || !this.state.email) {
            this.setError('Alle felter må fylles', 'danger');
			return;
		}

		// check password mismatch
        if (this.state.password1 !== this.state.password2) {
            this.setError('Passordene må være like', 'danger');
            return;
        }

        // check password strength
        if (this.state.password1.length < 5) {
            this.setError('Passord må inneholde minst 5 tegn', 'danger');
			return;
		}

		let user = new User();
		user.email = this.state.email;
		user.username = this.state.username;
		user.password = this.state.password1;

		// check username availability
		service.validateUsername(user.username).then(taken1 => {
			console.log('Check username, taken: ' + taken1);
            if (taken1) {
                this.setError('Brukernavn ikke tilgjengelig', 'danger');
            } else {

				// check email availability
				service.validateEmail(user.email).then(taken2 => {
					console.log('Check email, taken: ' + taken2);
                    if (taken2) {
                        this.setError('Epost ikke tilgjengelig', 'danger');
                    } else {

						service.createUser(user)
							.then(res => console.log('Submit user status: ' + res))
							.then(this.props.history.push("/logg-inn"))
                            .catch(err => this.setError('Bruker ikke opprettet', 'danger'));
					}
				})
			}
		});
	}

	render() {
		return (
			<Container style={{width: '40em'}}>

				<h1 className="HarmoniLogo display-3 text-center m-3">Harmoni</h1>

				<Card className="" style={{padding: '10px'}}>
                    <div style={{padding: '5%'}}>
                        <label className='h1'>Lag ny bruker</label>

                        {(this.state.error) ?
                            <Alert style={{height: '3em'}} variant={this.state.errorType}>{this.state.error}</Alert> :
                            <div style={{height: '3em'}}/>}

                        <Form>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Brukernavn</Form.Label>
                                <Form.Control
                                    type="username"
                                    placeholder="Skriv inn brukernavn"
                                    value={this.state.username}
                                    onChange={this.handleUsernameChange}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Skriv inn email"
                                    value={this.state.email}
                                    onChange={this.handleEmailChange}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword1">
                                <Form.Label>Passord</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Skriv inn passord"
                                    value={this.state.password1}
                                    onChange={this.handlePassword1Change}/>
                            </Form.Group>

                            <PasswordStrengthMeter password={this.state.password1}/>

                            <Form.Group controlId="formBasicPassword2">
                                <Form.Label>Gjenta passord</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Gjenta passord"
                                    value={this.state.password2}
                                    onChange={this.handlePassword2Change}/>
                            </Form.Group>

                            <Button
                                className="mr-2"
								onClick={this.handleSubmit}
								variant="primary"
								type="button">
								Opprett bruker
							</Button>

                            <Button
                                href="/"
                                variant="secondary"
                                type="button">
                                Avbryt
                            </Button>
                        </Form>
                    </div>
                </Card>
			</Container>
		);
	}

	mounted() {
	}
}