import { service } from "./services"
import decode from 'jwt-decode';

class AuthService {

	// Initializing important variables
	constructor() {
		this.login = this.login.bind(this);
	}

	login(email, password) {
		// Get a token from api server using the fetch api
		return service.login(email, password)
			.then(res => {
				console.log('res ' + res);
				this.setToken(res.token); // Setting the token in localStorage
				return Promise.resolve(res)
			})
	}

	loggedIn() {
		// Checks if there is a saved token and it's still valid
		const token = this.getToken(); // Getting token from localstorage
		return !!token && !this.isTokenExpired(token);
	}

	isTokenExpired(token) {
		try {
			return decode(token).exp < Date.now() / 1000;
		} catch (err) {
			return false;
		}
	}

	setToken(idToken) {
		// Saves user token to localStorage
		localStorage.setItem('token', idToken)
	}

	getToken() {
		// Retrieves the user token from localStorage
		return localStorage.getItem('token')
	}

	logout() {
		// Clear user token and profile data from localStorage
		localStorage.removeItem('token');
	}

	_checkStatus(response) {
		// raises an error in case response status is not a success
		if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
			return response
		} else {
			var error = new Error(response.statusText)
		}
	}
}

export let authService = new AuthService();