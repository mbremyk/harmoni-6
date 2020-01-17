import {Component} from "react-simplified";
import * as React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import NavLink from "react-bootstrap/NavLink";
import {authService} from "../AuthService";
import {Card} from "react-bootstrap";

export class LoginForm extends Component {
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
		if (!this.state.email || !this.state.password) {
			return;
		}
		authService.login(this.state.email, this.state.password).then(res => {
			window.location = '/hjem'
		})
	}

	render() {
		return (
			<Container style={{width: '40em'}}>
				<Card style={{padding: '10px', 'margin-top': '20%'}}>
                    <div style={{padding: '5%'}}>
                        <label className='h1'>Logg inn</label>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Skriv inn email"
                                    value={this.state.email}
                                    onChange={this.handleEmailChange}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Passord</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Skriv inn passord"
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}/>
                            </Form.Group>

                            <Button
                                onClick={this.handleLogin}
                                variant="primary"
                                type="button">
                                Login
                            </Button>
                            <Button
                                href="/"
                                variant="secondary"
                                type="button">
                                Avbryt
                            </Button>
                            <NavLink href={'/ny-bruker'}>Opprett bruker her!</NavLink>
                            <NavLink href={'/hjem'}>Trykk her om du ikke bli sent videre..</NavLink>
                        </Form>
                    </div>
				</Card>
			</Container>
		);
	}
}