import {Component} from "react-simplified";
import * as React from "react";

import {authService} from "../AuthService";

export class Logout extends Component {
	constructor(props) {
		super(props);

		authService.logout().then(res =>
		this.props.history.push('/'));
	}

	render() {
		return(
			<div/>
		)
	}
}