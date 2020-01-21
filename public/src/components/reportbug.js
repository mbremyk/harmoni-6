import {authService} from "../AuthService";
import {HarmoniNavbar} from "./navbar";
import NavLink from "react-bootstrap/NavLink";
import * as React from "react";
import {MailForm} from "../widgets";
import {Component} from "react-simplified";

export class BugForm extends Component {

	render() {
		return (
			<div>
				{this.RenderNavbar()}
				<MailForm toggleable={false} description={"Jeg har en bug"} hasRecipients={false}/>
			</div>
		)
	}

	RenderNavbar() {
		if (authService.loggedIn()) {
			return <HarmoniNavbar/>
		} else {
			return <NavLink href="/"><h1 className="HarmoniLogo display-3 text-center m-5 text-body">Harmoni</h1></NavLink>
		}
	}
}