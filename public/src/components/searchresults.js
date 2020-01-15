import {Component} from "react-simplified";
import * as React from 'react';
import {service} from '../services';
import {SortedEventView} from "./sortedeventview";
import {HarmoniNavbar} from "./navbar";
import {Fragment} from "react";

export class SearchResults extends Component {
    state = {
        events: []
    };

    render() {
        if (!(Array.isArray(this.state.events) && this.state.events.length)){
            return (
                <Fragment>
                    <HarmoniNavbar/>
                    <h1>Ingen resultater funnet</h1>
                </Fragment>
            )
        } else {
                return (
                    <Fragment>
                        <HarmoniNavbar/>
                        <SortedEventView events={this.state.events}/>
                    </Fragment>
                )
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