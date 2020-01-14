import {Component} from "react-simplified";
import {Container, Row} from "react-bootstrap";
import * as React from 'react';
import {service} from '../services';
import Dropdown from "react-bootstrap/Dropdown";
import {EventInfo} from "../widgets";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export class SortedEventView extends Component {
    state = {
        events: [],
        eventsBackup: [],
        order: "asc",
        sortingOption: "createdAt"
    };

    sortEvents = (sortingOption, order) => {
        this.setState({events: this.state.events.sort(this.compareValues(sortingOption, order))});
    };

    handleSortingOption = (option) => {
        this.setState({sortingOption: option});
        this.sortEvents(option, this.state.order);
    };

    componentDidUpdate(prevProps) {
        if (this.props.events !== prevProps.events) {
            this.handleEvents(this.props.events);
        }
    }

    handleFilterOption(filter) {
        switch (filter) {
            case 'ChildFriendly':
                this.setState({events: this.state.events.filter(e => e.ageLimit < 7)});
                break;
        }
    }

    handleReset() {
        this.setState({events: this.state.eventsBackup})
    }

    handleOrder(order) {
        this.setState({order: order});
        this.sortEvents(this.state.sortingOption, order);
    }

    handleEvents = (events) => {
        this.setState({events: events, eventsBackup: events})
    };

    compareValues(key, order = 'asc') {
        return function innerSort(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                console.log("Error: not comparable!");
                return 0;
            }

            const varA = (typeof a[key] === 'string')
                ? a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string')
                ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order === 'desc') ? (comparison * -1) : comparison
            );
        };
    }

    render() {
        if (this.state.events !== []) {
            return (
                <Container>
                    <Card>
                        <Row>
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                                        Sorter arrangementer
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => this.handleSortingOption('price')}>Pris
                                            TODO</Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => this.handleSortingOption('ageLimit')}>Aldersgrense </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => this.handleSortingOption('createdAt')}>Publisert</Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => this.handleSortingOption('address')}>Adresse</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                            </Col>
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                                        Filtere
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => this.handleFilterOption('ChildFriendly')}>Barnevennelig
                                            (6 år) </Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.handleFilterOption('Free')}>Gratis
                                            Arrangementer
                                            TODO </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col>
                                <Button onClick={() => this.handleOrder("asc")} variant={"light"}>Økende ↑</Button>
                            </Col>
                            <Col>
                                <Button onClick={() => this.handleOrder("desc")} variant={"light"}>Synkende ↓</Button>
                            </Col>
                            <Col>
                                <Button variant={"danger"} onClick={this.handleReset}>Nullstill</Button>
                            </Col>
                        </Row>
                    </Card>
                    <Row>

                        {this.state.events.map(event => (
                            <EventInfo
                                link={event.eventId}
                                imageUrl={event.imageUrl}
                                title={event.eventName}
                                address={event.address}
                                age_limit={event.ageLimit}
                                start_date={event.startTime}
                                end_date={event.endTime}
                                uploaded={event.createdAt}
                                myEvent={this.props.myEvent}
                            />
                        ))}

                    </Row>
                </Container>
            )
        }
    };


    mounted() {
        if (this.props.events) {
            this.handleEvents(this.props.events);
        } else {
            service
                .getEvents()
                .then(events => (this.handleEvents(events)))
                .catch((error) => console.log(error));
        }

    }


}

