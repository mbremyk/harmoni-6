import { service } from "./services"
import decode from 'jwt-decode';

export class AuthService {

	// Initializing important variables
	constructor() {
		this.login = this.login.bind(this);
	}

	login(email, password) {
		return service.login(email, password)
			.then(res => {
				this.setToken(res.jwt);
				return res;
			}).catch(res => {return res;})
	}

	refresh() {
		return service.refreshToken().then(res => {
			this.setToken(res.jwt);
			return res
		})
	}

	loggedIn() {
		const token = this.getToken();
		return !!token && !this.isTokenExpired(token);
	}

	isTokenExpired(token) {
		try {
			return decode(token).exp < Date.now() / 1000;
		} catch (err) {
			return false;
		}
	}

	setToken(token) {
		localStorage.setItem('token', token)
	}

	getToken() {
		return localStorage.getItem('token')
	}

	deleteToken() {
		localStorage.removeItem('token')
	}

	logout() {
		return service.logout().then(res => this.deleteToken());
	}

	_checkStatus(response) {
		if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
			return response
		} else {
			var error = new Error(response.statusText)
		}
	}
}

export let authService = new AuthService();