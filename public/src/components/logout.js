import {Component} from "react-simplified";
import * as React from "react";

import {authService} from "../AuthService";

export class LoginForm extends Component {
	constructor(props) {
		super(props);

		authService.logout().then(res => {
			// history.push('/');
		})
	}
}