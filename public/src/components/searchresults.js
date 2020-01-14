import {Component} from "react-simplified";
import * as React from 'react';
import {service} from '../services';
import {SortedEventView} from "./sortedeventview";

export class SearchResults extends Component {
    state = {
        events: []
    };

    render() {
        if (!(Array.isArray(this.state.events) && this.state.events.length) ) {
            return <h1>Ingen resultater funnet</h1>;
        } else {
            return <SortedEventView events={this.state.events}/>
        }
    }

    mounted() {
        service
            .searchForEvents(this.props.match.params.input)
            .then(events => {
                this.setState({events: events});
            })
            .catch((error) => console.log(error));
    }
}