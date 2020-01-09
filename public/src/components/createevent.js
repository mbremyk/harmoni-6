import {Component} from "react-simplified";
import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import DateTimePicker from 'react-datetime-picker';
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

export class addEvent extends Component{

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

    constructor(props) {
        super(props);
        this.state = {
            eventName: '',
            eventAdress: '',
            eventDescription: '',
            ageLimit: 0,
            fDate: new Date(),
            tDate: new Date(),
            riderFilename: '',
        };
        this.eventName = this.handleEventNameChange.bind(this);
        this.eventAdress = this.handleEventAdressChange.bind(this);
        this.eventDescription = this.handleEventDescriptionChange.bind(this);
        this.ageLimit = this.handleAgeLimitChange.bind(this);
        this.riderFilename = this.handleRiderChange.bind(this);
    }

    handleEventNameChange(event){
        this.setState({eventName: event.target.value});
    }

    handleEventAdressChange(event){
        this.setState({eventAdress: event.target.value});
    }

    handleEventDescriptionChange(event){
        this.setState({eventDescription: event.target.value});
    }

    handleAgeLimitChange(event){
        this.setState({ageLimit: event.target.value});
    }

    handleRiderChange(event){
        this.setState({riderFilename: event.target.value})
    }

    onChange = (date) => this.setState({ date });

    artists = [];

    render(){
        return(
            <Container>
                <h1 className="font-weight-bold text-center">Opprett arrangement</h1>
                <Form>
                    <Form.Label column={1}>Arrangementsnavn</Form.Label>
                    <Form.Control
                        placeholder="Navn på arrangement . . ."
                        value={this.eventName}
                        onChange={(event) => {
                            this.eventName = event.target.value;
                        }
                        }
                    />

                    <Form.Label column={1}>Adresse</Form.Label>
                    <Form.Control
                        placeholder="Adresse der arrangementet skal holdes . . ."
                        value={this.eventAdress}
                        onChange={(event) => {this.eventAdress = event.target.value}}

                    />

                    <Form.Label column={1}>Beskrivelse</Form.Label>
                    <Form.Control
                        placeholder="Her kan du skrive en kort beskrivelse av arrangementet (max. 500 ord) . . ."
                        as="textarea"
                        rows="8"
                        value={this.eventDescription}
                        onChange={(event) => this.eventDescription = event.target.value}
                    />

                    <Form.Label column={1}>Artist</Form.Label>

                    <Row>
                        <Col>
                            <Form.Label column={1}>Fra Dato:</Form.Label>
                            <DateTimePicker
                                className="m-4 font-weight-bold"
                                id = 'fromDatePicker'
                                name = 'fdate'
                                selected={this.state.fDate}
                                value={this.state.fDate}
                                onChange={date => this.changeDate('fdate', date)}
                            >
                                /*{console.log(this.state.fDate)}*/
                            </DateTimePicker>
                        </Col>
                        <Col>
                            <Form.Label column={1}>Til Dato:</Form.Label>
                            <DateTimePicker
                                className="m-4 font-weight-bold"
                                id='toDatePicker'
                                name='tdate'
                                selected={this.state.tDate}
                                value={this.state.tDate}
                                onChange={date => this.changeDate('tdate', date)}
                            >
                                /*{console.log(this.state.tDate)}*/
                            </DateTimePicker>
                        </Col>
                    </Row>

                    <Form.Label column={1}>Aldersgrense</Form.Label>
                    <ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups">
                        <ButtonGroup className="mr-2" aria-label="button-group">
                            <Button onClick={this.decrementAge}>-</Button>
                            <Button onClick={this.IncrementAge}>+</Button>
                            {console.log(this.ageLimit)}
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
                        <Dropdown onSelect={(eventKey) => this.addArtist(eventKey)}>
                            <Dropdown.Toggle variant={"success"} id="dropdown">
                                Velg artist
                            </Dropdown.Toggle>

                    <Row>
                        <Col>
                            <Form.Label column={1}>Last opp rider</Form.Label>
                            <InputGroup className="mb-5">
                                <FormControl
                                    type="file"
                                    value={this.riderFilename}
                                />
                            </InputGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={{span: 3, offset: 5}}>
                            <Button type="submit">Opprett arrangementet</Button>
                        </Col>
                    </Row>
                            <Dropdown.Menu as={this.CustomMenu}>
                                <Dropdown.Item eventKey="Marius">Marius</Dropdown.Item>
                                <Dropdown.Item eventKey="Jakob">Jakob</Dropdown.Item>
                                <Dropdown.Item eventKey="Steffen">Steffen</Dropdown.Item>
                                <Dropdown.Item eventKey="Jan">Jan</Dropdown.Item>
                            </Dropdown.Menu>

                        </Dropdown>
                            <ListGroup title={"Valgte artister"}>
                                {this.artists.map(artist => (
                                    <React.Fragment key={artist}>
                                    <ListGroupItem>
                                    {artist}
                                </ListGroupItem></React.Fragment>))}
                            </ListGroup>
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

}
