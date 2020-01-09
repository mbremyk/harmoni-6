import {Component} from "react-simplified";
import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import DateTimePicker from 'react-datetime-picker';
import Col from "react-bootstrap/Col";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

export class addEvent extends Component{

    eventName = "";

    eventAdress = "";

    eventDescription = "";

    ageLimit = 0;

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
        fDate: new Date(),
        tDate: new Date()
    };

    riderFilename = "";

    onChange = (date) => this.setState({ date });

    artists = [];

    render(){
        return(
            <Container>
                <Form>
                    <Form.Row>

                        <Form.Group as={Col} xs={"12"}>
                            <h1 className="font-weight-bold text-center">Opprett arrangement</h1>
                        </Form.Group>

                        <Form.Group as={Col} xs={"12"}>
                            <Form.Label>Arrangementsnavn</Form.Label>
                            <Form.Control
                                placeholder="Navn på arrangement . . ."
                                value={this.eventName}
                                onChange={(event) => {
                                    this.eventName = event.target.value;
                                }
                                }
                            />
                        </Form.Group>

                        <Form.Group as={Col} xs={"12"}>
                            <Form.Label>Adresse</Form.Label>
                                <Form.Control
                                    placeholder="Adresse der arrangementet skal holdes . . ."
                                    value={this.eventAdress}
                                    onChange={(event) => {this.eventAdress = event.target.value}}

                                />
                        </Form.Group>

                        <Form.Group as={Col} xs={12}>
                            <Form.Label>Beskrivelse</Form.Label>
                                <Form.Control
                                    placeholder="Her kan du skrive en kort beskrivelse av arrangementet (max. 500 ord) . . ."
                                    as="textarea"
                                    rows="8"
                                    value={this.eventDescription}
                                    onChange={(event) => this.eventDescription = event.target.value}
                                />
                        </Form.Group>

                        <Form.Group as={Col} xs={"2"}>

                            <Form.Label>Artist</Form.Label>

                                <Dropdown onSelect={(eventKey) => this.addArtist(eventKey)}>

                                    <Dropdown.Toggle variant={"success"} id="dropdown">
                                        Velg artist
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu as={this.CustomMenu}>
                                        <Dropdown.Item eventKey="Marius">Marius</Dropdown.Item>
                                        <Dropdown.Item eventKey="Jakob">Jakob</Dropdown.Item>
                                        <Dropdown.Item eventKey="Steffen">Steffen</Dropdown.Item>
                                        <Dropdown.Item eventKey="Jan">Jan</Dropdown.Item>
                                    </Dropdown.Menu>

                                </Dropdown>

                        </Form.Group>

                        <Form.Group as={Col} xs={"10"}>

                            <ListGroup title={"Valgte artister"}>
                                {this.artists.map(artist => (
                                    <React.Fragment key={artist}>
                                        <ListGroupItem>
                                            {artist}
                                        </ListGroupItem>
                                    </React.Fragment>))}
                            </ListGroup>

                        </Form.Group>

                        <Form.Group as={Col} xs={"6"}>

                            <Form.Label>Fra Dato:</Form.Label>

                            <DateTimePicker
                                className="m-4 font-weight-bold"
                                id = 'fromDatePicker'
                                name = 'fdate'
                                selected={this.state.fDate}
                                value={this.state.fDate}
                                onChange={date => this.changeDate('fdate', date)}
                            />
                        </Form.Group>

                        <Form.Group as={Col} xs={"6"}>
                            <Form.Label>Til Dato:</Form.Label>
                            <DateTimePicker
                                className="m-4 font-weight-bold"
                                id='toDatePicker'
                                name='tdate'
                                selected={this.state.tDate}
                                value={this.state.tDate}
                                onChange={date => this.changeDate('tdate', date)}
                            />
                        </Form.Group>

                        <Form.Group as={Col} xs={"6"}>

                            <Form.Label>Aldersgrense</Form.Label>
                            <ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups">
                                    <ButtonGroup className="mr-2" aria-label="button-group">
                                        <Button onClick={this.decrementAge}>-</Button>
                                        <Button onClick={this.IncrementAge}>+</Button>
                                    </ButtonGroup>

                                <InputGroup>
                                    <FormControl
                                        value={this.ageLimit}
                                        onChange={(event) => this.ageLimit = event.target.value}
                                        aria-label="btn-age"
                                        aria-describedby="btnGroupAddon"
                                    />

                                    <InputGroup.Append>
                                        <InputGroup.Text id="btnGroupAddon">år</InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup>
                            </ButtonToolbar>
                        </Form.Group>

                        <Form.Group as={Col} xs={"6"}>
                            <Form.Label>Last opp rider</Form.Label>
                            <InputGroup className="mb-5">
                                <FormControl
                                    type="file"
                                    value={this.riderFilename}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group as={Col}  md={{span: 3, offset: 5}}>
                                <Button type="submit">Opprett arrangementet</Button>
                        </Form.Group>

                    </Form.Row>
                </Form>
            </Container>
        );
    }

    changeDate(dateName, dateValue){
        let {fDate, tDate} = this.state;
        if(dateName === 'fdate'){
            fDate = dateValue;
        }else{
            tDate = dateValue;
        }
        this.setState({
            fDate,
            tDate
        });
    }

    IncrementAge(){
        this.ageLimit++;
    }

    decrementAge(){
        if (this.ageLimit > 0) {
            this.ageLimit--;
        }
    }

    addArtist(eventKey) {
        this.artists.push(eventKey);
    }
}
