import {Component} from "react-simplified";
import {Container, Row} from "react-bootstrap";
import * as React from 'react';
import {service} from '../services';
import Dropdown from "react-bootstrap/Dropdown";
import {EventInfo} from "../widgets";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import moment from "moment";

export class SortedEventView extends Component {
    state = {
        events: [],
        eventsBackup: [],
        order: "desc",
        sortingOption: "createdAt",
        ascDescription: "Eldst først", //  ↑
        descDescription: "Nyest først", //  ↓
        orderDescription: ["createdAt", "startTime"],

        childFriendly: "",
        free: "",
        hideCancelled: "",
        showOld: "",
        filterActive: ""
    };

    getActiveState = (option) => {
        if (option === "asc" || option === "desc") return (option === this.state.order) ? "active" : "";
        return (option === this.state.sortingOption) ? "active" : "";
    };

    sortEvents = (sortingOption, order) => {
        this.setState({events: this.state.events.sort(this.compareValues(sortingOption, order))});
        //this.setState({order: "asc"})
    };

    handleOrderDescription = (option) => {
        if (this.state.orderDescription.includes(option)) {
            this.setState({ascDescription: "Eldst først"});
            this.setState({descDescription: "Nyest først"})
        } else {
            this.setState({ascDescription: "Stigende ↑"});
            this.setState({descDescription: "Synkende ↓"})
        }
    };

    handleSortingOption = (option) => {
        this.handleOrderDescription(option);
        this.setState({sortingOption: option});
        this.setState({option: "active"});
        this.sortEvents(option, this.state.order);
    };

    componentDidUpdate(prevProps) {
        if (this.props.events !== prevProps.events) {
            this.handleEvents(this.props.events);
        }
    }

    handleFilterOption(filter) {
        this.setState({filterActive: "active"});
        switch (filter) {
            case 'ChildFriendly':
                this.setState({events: this.state.events.filter(event => event.ageLimit < 7)});
                this.setState({childFriendly: "active"});
                break;
            case 'HideCancelled':
                this.setState({events: this.state.events.filter(event => !event.cancelled)});
                this.setState({hideCancelled: "active"});
                break;
            case 'ShowOld':
                this.setState({events: this.state.eventsBackup});
                this.setState({showOld: "active"});
                break;
            case 'Free':
                //TODO
                this.setState({showOld: "active"});
                break;
        }
    }

    handleReset() {
        this.handleEvents(this.state.eventsBackup);

        this.setState({childFriendly: ""});
        this.setState({free: ""});
        this.setState({hideCancelled: ""});
        this.setState({showOld: ""});
        this.setState({sortingOption: "createdAt"});
        this.setState({filterActive: ""});
        this.setState({order: "desc"});
        this.setState({ascDescription: "Eldst først"});
        this.setState({descDescription: "Nyest først"})

    }

    handleOrder(order) {
        this.setState({order: order});
        this.sortEvents(this.state.sortingOption, order);
    }

    handleEvents = (events) => {
        let now = moment().format('YYYY-MM-DD HH:MM');
        this.setState({
            events: events.filter(event => moment(now).isBefore(event.endTime)),
            eventsBackup: events
        })
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
                <Container id="scrollTo">
                    <Card bg={"light"}>
                        <Row>
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle className={"active"} variant="light" id="dropdown-basic">
                                        Sorter arrangementer
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item className={this.getActiveState("price")}
                                                       onClick={() => this.handleSortingOption('price')}>Pris
                                            TODO</Dropdown.Item>
                                        <Dropdown.Item className={this.getActiveState("ageLimit")}
                                                       onClick={() => this.handleSortingOption('ageLimit')}>Aldersgrense </Dropdown.Item>
                                        <Dropdown.Item className={this.getActiveState("createdAt")}
                                                       onClick={() => this.handleSortingOption('createdAt')}>Publisert</Dropdown.Item>
                                        <Dropdown.Item className={this.getActiveState("address")}
                                                       onClick={() => this.handleSortingOption('address')}>Adresse</Dropdown.Item>
                                        <Dropdown.Item className={this.getActiveState("startTime")}
                                                       onClick={() => this.handleSortingOption('startTime')}>Dato</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                            </Col>
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle className={this.state.filterActive} variant="light"
                                                     id="dropdown-basic">
                                        Filtere
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item className={this.state.childFriendly}
                                                       onClick={() => this.handleFilterOption('ChildFriendly')}>Barnevennelig
                                            (6 år) </Dropdown.Item>
                                        <Dropdown.Item className={this.state.free}
                                                       onClick={() => this.handleFilterOption('Free')}>Gratis
                                            Arrangementer TODO </Dropdown.Item>
                                        <Dropdown.Item className={this.state.hideCancelled}
                                                       onClick={() => this.handleFilterOption('HideCancelled')}>
                                            Skjul kansellerte arrangementer
                                        </Dropdown.Item>
                                        <Dropdown.Item className={this.state.showOld}
                                                       onClick={() => this.handleFilterOption('ShowOld')}>
                                            Vis gamle arrangementer
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col>
                                <Button className={this.getActiveState("asc")} onClick={() => this.handleOrder("asc")}
                                        variant={"light"}>{this.state.ascDescription}</Button>
                            </Col>
                            <Col>
                                <Button className={this.getActiveState("desc")} onClick={() => this.handleOrder("desc")}
                                        variant={"light"}>{this.state.descDescription}</Button>
                            </Col>
                            <Col>
                                <Button variant={"light"} onClick={this.handleReset}>Nullstill</Button>
                            </Col>


                        </Row>
                    </Card>
                    <Row>

                        {this.state.events.map(event => (
                            <EventInfo
                                event={event}
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

