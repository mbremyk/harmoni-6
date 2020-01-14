import {Component} from "react-simplified";
import * as React from 'react';
import {service} from '../services';
import {SortedEventView} from "./sortedeventview";

export class SearchResults extends Component {
    state = {
        events: false
    };

    render() {
        if (this.state.events) {
            console.log("render: " + this.state.events);
            return <SortedEventView events={this.state.events}/>
        } else {
            return null
        }
    }

    mounted() {
        console.log('Search input: ' + this.props.match.params.input);
        service
            .searchForEvents(this.props.match.params.input)
            .then(events => {
                this.setState({events: events});
                console.log("search mounted");
                console.log(events)
            })
            .catch((error) => console.log(error));
    }
}