import {Component} from "react-simplified";
import {Container, Row} from "react-bootstrap";
import * as React from 'react';
import {service} from '../services';
import Dropdown from "react-bootstrap/Dropdown";
import {EventInfo} from "../widgets";

export class SortedEventView extends Component{
    state = {
        events : []
    };

    handleSortingOption = (option) =>{
        console.log(option);
        switch (option) {
            case 'PriceAsc':
                //TODO
                break;
            case 'PriceDesc':
                //TODO
                break;
            case 'AgeLimitAsc':
                this.setState({events: this.state.events.sort(this.compareValues('ageLimit'))});
                break;
            case 'AgeLimitDesc':
                this.setState({events: this.state.events.sort(this.compareValues('ageLimit', 'desc'))});
                break;
            case 'DateAsc':
                this.setState({events: this.state.events.sort(this.compareValues('startTime'))});
                break;
            case 'DateDesc':
                this.setState({events: this.state.events.sort(this.compareValues('startTime', 'desc'))});
                break;
            case 'AddressAsc':
                this.setState({events: this.state.events.sort(this.compareValues('address'))});
                break;
            case 'AddressDesc':
                this.setState({events: this.state.events.sort(this.compareValues('address', 'desc'))});
                break;
        }
    };

    compareValues(key, order = 'asc') {
        console.log(key);
        return function innerSort(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                console.log("No key found: comparator");
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


    handleEvents = (events) => {
        this.setState({events : events})
    };

    render() {
        return(
            <Container>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        Sorter arrangementer
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => this.handleSortingOption('PriceAsc')}>Pris (Stigende) TODO</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleSortingOption('PriceDesc')}>Pris (Synkende) TODO</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleSortingOption('AgeLimitAsc')}>Aldersgrense (Stigende)</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleSortingOption('AgeLimitDesc')}>Aldersgrense (Synkende)</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleSortingOption('DateAsc')}>Eldst først TODO </Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleSortingOption('DateAsc')}>Nyest Først TODO </Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleSortingOption('AddressAsc')}>Adresse (Stigende) </Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleSortingOption('AddressDesc')}>Adresse (Synkende) </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>


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
                        />
                    ))}

                </Row>
            </Container>
        )
    };


    mounted()
    {
        service
            .getEvents()
            .then(events => (this.handleEvents(events)))
            .catch((error) => console.log(error));



    }
}

