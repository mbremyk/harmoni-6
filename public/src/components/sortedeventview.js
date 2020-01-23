import {Component} from "react-simplified";
import {Container, NavItem, Row} from "react-bootstrap";
import * as React from 'react';
import {service} from '../services';
import Dropdown from "react-bootstrap/Dropdown";
import {EventInfo} from "../widgets";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import moment from "moment";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

export class SortedEventView extends Component {
    state = {
        events: [],
        eventsBackup: [],
        filteredEvents: [],
        order: "asc",
        sortingOption: "startTime",
        ascDescription: "Eldst først", //  ↑
        descDescription: "Nyest først", //  ↓
        orderDescription: ["createdAt", "startTime"],

        childFriendly: "",
        free: "",
        hideCancelled: "",
        showOld: "",
        filterActive: "",
        filterTxt: "",
    };

    handleFilterTxt = (event) =>{
        this.setState({filterTxt: event.target.value});
        //let regex = new RegExp( event.target.value, 'i');
        //this.setState({events: this.state.events.filter(event => event.eventName.match(regex) || event.description.match(regex))})
    };

    getFilteredEvents = (events) =>{
        let regex = new RegExp( this.state.filterTxt, 'i');
        return events.filter(event => event.eventName.match(regex) || event.description.match(regex))
    };


    getActiveState = (option) => {
        if (option === "asc" || option === "desc") return (option === this.state.order) ? "active" : "";
        return (option === this.state.sortingOption) ? "active" : "";
    };

    sortEvents = (sortingOption, order) => {
        this.setState({events: this.state.events.sort(this.compareValues(sortingOption, order))});
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
        console.log("filter option: " + filter);
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
        this.setState({sortingOption: "startTime"});
        this.setState({filterActive: ""});
        this.setState({order: "asc"});
        this.setState({ascDescription: "Eldst først"});
        this.setState({descDescription: "Nyest først"});
        this.setState({filterTxt: ""});

    }

    handleOrder(order) {
        this.setState({order: order});
        this.sortEvents(this.state.sortingOption, order);
    }

    handleEvents = (events) => {
        let now = moment().format('YYYY-MM-DD HH:MM');
        this.setState({
            events: events.filter(event => moment(now).isBefore(event.endTime)),
            filteredEvents: events.filter(event => moment(now).isBefore(event.endTime)),
            eventsBackup: events
        });
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
                <Container className={"c-lg"} id="scrollTo">
                    <Navbar className={"shadow-sm mt-2"} bg="light" expand="lg">
                        <Navbar.Brand>Filtrer og sorter</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <NavDropdown className={"active"} title="Sorter" id="basic-nav-dropdown">
                                    <NavDropdown.Item className={this.getActiveState("ageLimit")}
                                                      onClick={() => this.handleSortingOption('ageLimit')}>Aldersgrense </NavDropdown.Item>
                                    <NavDropdown.Item className={this.getActiveState("createdAt")}
                                                      onClick={() => this.handleSortingOption('createdAt')}>Publisert</NavDropdown.Item>
                                    <NavDropdown.Item className={this.getActiveState("address")}
                                                      onClick={() => this.handleSortingOption('address')}>Adresse</NavDropdown.Item>
                                    <NavDropdown.Item className={this.getActiveState("startTime")}
                                                      onClick={() => this.handleSortingOption('startTime')}>Dato</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown className={this.state.filterActive} title="Filtere" id="basic-nav-dropdown">
                                    <Dropdown.Item className={this.state.childFriendly}
                                                   onClick={() => this.handleFilterOption('ChildFriendly')}>Barnevennelig
                                        (6 år) </Dropdown.Item>
                                    <Dropdown.Item className={this.state.hideCancelled}
                                                   onClick={() => this.handleFilterOption('HideCancelled')}>
                                        Skjul kansellerte arrangementer
                                    </Dropdown.Item>
                                    <Dropdown.Item className={this.state.showOld}
                                                   onClick={() => this.handleFilterOption('ShowOld')}>
                                        Vis gamle arrangementer
                                    </Dropdown.Item>
                                </NavDropdown>
                                <NavItem>
                                    <Button className={this.getActiveState("asc")} onClick={() => this.handleOrder("asc")}
                                            variant={"light"}>{this.state.ascDescription}</Button>
                                </NavItem>
                                <NavItem>
                                    <Button className={this.getActiveState("desc")} onClick={() => this.handleOrder("desc")}
                                            variant={"light"}>{this.state.descDescription}</Button>
                                </NavItem>
                                <NavItem>
                                    <Button className={"ml-sm-5"} variant={"light"} onClick={this.handleReset}>Nullstill</Button>
                                </NavItem>
                            </Nav>
                            <Form inline onSubmit={e => {e.preventDefault()}}>
                                <FormControl value={this.state.filterTxt} onChange={this.handleFilterTxt} type="text" placeholder="Skriv for å filtrere ..." className="mr-sm-2"/>
                            </Form>
                        </Navbar.Collapse>
                    </Navbar>
                    <Row>

                        {this.getFilteredEvents(this.state.events).map(event => (
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

