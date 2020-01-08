import {Component} from "react-simplified";
import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import DateTimePicker from 'react-datetime-picker';
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import FormControl from "react-bootstrap/FormControl";
import {Button} from "react-bootstrap";

export class addEvent extends Component{

    CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            ref={ref}
            onClick={e => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
            &#x25bc;
        </a>
    ));

    CustomMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
            const [value, setValue] = React.useState('');

            return (
                <div
                    ref={ref}
                    style={style}
                    className={className}
                    aria-labelledby={labeledBy}
                >
                    <FormControl
                        autoFocus
                        className="mx-3 my-2 w-auto"
                        placeholder="Type to filter..."
                        onChange={e => setValue(e.target.value)}
                        value={value}
                    />
                    <ul className="list-unstyled">
                        {React.Children.toArray(children).filter(
                            child =>
                                !value || child.props.children.toLowerCase().startsWith(value),
                        )}
                    </ul>
                </div>
            );
        },
    );

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

                        <Dropdown>
                            <Dropdown.Toggle as={this.CustomToggle} id="dropdown" onSelect={this.save()}>
                                Custom toggle
                            </Dropdown.Toggle>

                            <Dropdown.Menu as={this.CustomMenu}>
                                <Dropdown.Item eventKey="1">Red</Dropdown.Item>
                                <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
                                <Dropdown.Item eventKey="3" active>
                                    Orange
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form>
                </Card>
            </Container>
        );
    }

    save() {
        console.log("tset");
        console.log(document.getElementById("dropdown"));
    }
}
