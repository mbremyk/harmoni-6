import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
import { HashRouter, BrowserRouter, Route,  NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { createHashHistory, createBrowserHistory } from 'history';
//import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free"
import {CreateUserForm} from '../src/components/createuser';
import {LoginForm} from "./components/login";


//const history = createHashHistory();
const history = createBrowserHistory();
const url = "http://localhost:5001/harmoni-6/us-central1/webApi/api/v1/";

class Test extends Component{
    render(){
        return(
            <div>
                <button onClick={this.test}>Test webapp</button>
            </div>
        );
    }
    test(){
        console.log("Test called");
        fetch(url+"test", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'x-access-token': 'undefined',
                "Access-Control-Allow-Origin": "true"
            }
        })
            .then(res => alert(res.json()))
            .catch(err => alert(err));
    }
}

const root = document.getElementById('root');
if (root)
    ReactDOM.render(
    <BrowserRouter>
    <div>
    <Route exact path="/" component={Test} />
    <Route exact path="/logg-inn" component={LoginForm} />


    </div>
    </BrowserRouter>,
root
);