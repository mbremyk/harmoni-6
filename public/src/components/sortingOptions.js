import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form, Alert, Image} from "react-bootstrap";
import * as React from 'react';
import {Event, service, Ticket} from '../services';
import Dropdown from "react-bootstrap/Dropdown";

export class SortingOptions extends Component{

    render() {
        return(
            <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    Sorter arrangementer
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => this.props.onSort('PriceAsc')}>Pris (Stigende) TODO</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.props.onSort('PriceDesc')}>Pris (Synkende) TODO</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.props.onSort('AgeLimitAsc')}>Aldersgrense (Stigende)</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.props.onSort('AgeLimitDesc')}>Aldersgrense (Synkende)</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.props.onSort('DateAsc')}>Eldst først TODO </Dropdown.Item>
                    <Dropdown.Item onClick={() => this.props.onSort('DateAsc')}>Nyest Først TODO </Dropdown.Item>
                    <Dropdown.Item onClick={() => this.props.onSort('AddressAsc')}>Adresse (Stigende) </Dropdown.Item>
                    <Dropdown.Item onClick={() => this.props.onSort('AddressDesc')}>Adresse (Synkende) </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    };


    mounted() {

    }
}

