import {Component} from "react-simplified";
import * as React from "react";
import NavLink from "react-bootstrap/NavLink";
import {CardColumns} from "react-bootstrap";
import {MailForm} from "../widgets";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export class Footer extends Component {

    render() {
        return (
            <div className="footer bg-light text-center p-5 mt-5 mb-0">
                <Row>
                    <Col>
                        <p className="text-dark font-italic">Harmoni</p>
                    </Col>
                    <Col>
                        <p className="text-dark">
                            Følg oss her: <NavLink href="https://www.facebook.com/Marius.Torbjornsen">
                            <u className="text-dark">Facebook</u></NavLink>
                        </p>
                    </Col>
                    <Col>
                        <p className="text-dark">
                            Rapporter bugs: <NavLink href="/bugs">
                            <u className="text-dark">Meld inn</u></NavLink>
                        </p>
                    </Col>
                </Row>
            </div>
        );
    }
}