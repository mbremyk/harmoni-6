import {Component} from "react-simplified";
import * as React from "react";
import NavLink from "react-bootstrap/NavLink";
import {CardColumns} from "react-bootstrap";

export class Footer extends Component {

    render() {
        return (
            <div className="footer bg-light text-center p-5 mt-5 mb-0 fixed-bottom">
                <CardColumns>
                    <p className="text-dark font-italic">Harmoni</p>
                    <p className="text-dark">
                        Følg oss her: <NavLink href="https://www.facebook.com/Marius.Torbjornsen">
                        <u className="text-dark">Facebook</u></NavLink>
                    </p>
                </CardColumns>

            </div>
        );
    }
}