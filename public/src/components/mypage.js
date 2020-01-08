import * as React from 'react';
import {Component} from "react-simplified";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export class myPage extends Component {
    name = "Navn Navnesen";
    email = "epost@eposten.no";
    render() {
        return(
            <Container>
                <Form>
                    <h1>Min side</h1>
                    <Form.Group>
                        <Form.Label>Navn</Form.Label>
                        <Form.Control size="lg" value={this.name} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.name = event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>E-post</Form.Label>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control size="lg" value={this.email} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.email = event.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Passord</Form.Label>
                        <text className="text-danger"> *</text>
                        <Form.Control size="lg" type="password" placeholder="Passord" />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Nytt passord</Form.Label>
                        <Form.Control size="lg" type="password" placeholder="Nytt passord" />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Gjenta nytt passord</Form.Label>
                        <Form.Control size="lg" type="password" placeholder="Gjenta nytt passord" />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={this.save}>
                        Lagre
                    </Button>
                </Form>
            </Container>
        );
    }
    save() {
        console.log("hello");
    }
}
