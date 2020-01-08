import {Component} from "react-simplified";
import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import DateTimePicker from 'react-datetime-picker';
import Card from "react-bootstrap/Card";
export class addEvent extends Component{

    state = {
        date: new Date(),
    };


    onChange = date => this.setState({ date });

    render(){
        return(
            <Container>
                <Card>
                    <Form>
                        <Form.Label column={1}>Arrangementsnavn</Form.Label>
                        <Form.Control placeholder="Navn på arrangement"/>

                        <Form.Label column={1}>Adresse</Form.Label>
                        <Form.Control placeholder="Adresse der arrangementet skal holdes" />

                        <Form.Label column={1}>Beskrivelse</Form.Label>
                        <Form.Control as="textarea" />

                        <Form.Label column={1}>Artist</Form.Label>

                            <div>
                                <Form.Label column={1}>Dato</Form.Label>

                                <DateTimePicker
                                    onChange={this.onChange}
                                    value={this.state.date}
                                >
                                    {console.log(this.state.date)}
                                </DateTimePicker>


                            </div>
                        <Form.Label column={1}>Aldersgrense</Form.Label>


                    </Form>
                </Card>
            </Container>
        );
    }
}
