import {Component} from "react-simplified";
import * as React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import NavLink from "react-bootstrap/NavLink";
import {authService} from "../AuthService";
import {Card} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

export class LoginForm extends Component {
    constructor(props) {
        super(props);

        if(authService.loggedIn()) { window.location = '/hjem'; }

        this.state = {
            email: '',
            password: '',
            error: '',
            errorType: 'success',
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

    setError(message, variant) {
        this.setState({error: message, errorType: variant});
        setTimeout(() => this.setState({error: '', errorType: 'primary'}), 5000);
    }

    async handleLogin() {
        if (!this.state.email || !this.state.password) {
            this.setError('Alle felter må fylles.', 'danger');
            return;
        }

        let result = await authService.login(this.state.email, this.state.password);

        if(authService.loggedIn()) {
	        window.location = '/hjem'
        } else {
	        this.setError('Innlogging feilet', 'danger');
        }
    }

    render() {
        return (
            <Container style={{width: '40em', top: '0'}}>

				<h1 className="HarmoniLogo display-3 text-center m-5">Harmoni</h1>

                <Card className="m-5" style={{padding: '10px',}}>
                    <div style={{padding: '5%'}}>

                        <h1 className='h1 text-center'>Logg inn</h1>

                        {(this.state.error) ?
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
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Passord</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Skriv inn passord"
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}/>
                            </Form.Group>

                            <Button
	                            className="mr-2"
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
                            <NavLink className='mt-3' href={'/ny-bruker'}>Opprett bruker her!</NavLink>
                            <NavLink href={'/nytt-passord'}>Glemt passord</NavLink>
                        </Form>
                    </div>
                </Card>
            </Container>
        );
    }
}