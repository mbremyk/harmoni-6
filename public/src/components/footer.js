import {Component} from "react-simplified";
import * as React from "react";
import NavLink from "react-bootstrap/NavLink";
import {CardColumns} from "react-bootstrap";

export class Footer extends Component{

	render() {
		return (
			<div className="-fill">
				<div className="bg-secondary text-center align-bottom" style={{height: "100px"}}>
					<CardColumns>

						<p className="text-white font-italic">Harmoni</p>

						<p className="text-white">
							Kontakt oss her: <NavLink href="https://www.facebook.com/Marius.Torbjornsen">
							<u className="text-white">Facebook</u></NavLink>
						</p>

					</CardColumns>

				</div>
			</div>
		);
	}
}