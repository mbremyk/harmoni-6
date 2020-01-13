import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
import { HashRouter, BrowserRouter, Route,  NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { createHashHistory, createBrowserHistory } from 'history';
//import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free"
import {CreateUserForm} from '../src/components/createuser';
import {LandingPage} from "./components/landingpage";
import {LoginForm} from "./components/login";
import {navbar} from "./components/navbar.js";
import {myPage} from "./components/mypage.js";
import {addEvent} from '../src/components/createevent.js';
import {HomePage} from "./components/homepage";
import {EventPage} from "./components/eventpage";
import {Logout} from './components/logout'
import {EditEvent} from "./components/editevent";

import {authService} from "./AuthService";
import {PrivateRoute} from "./components/PrivateRoute";

//const history = createHashHistory();
const history = createBrowserHistory();
const url = "http://localhost:5001/harmoni-6/us-central1/webApi/api/v1/";

// PrivateRoute sends user to /logg-inn if loggedIn() is false
const root = document.getElementById('root');
if (root)
    ReactDOM.render(
    <BrowserRouter>
    <div>
        <Route path="/" component={navbar}/>
        <Route exact path="/" component={LandingPage}/>
        <Route exact path="/ny-bruker" component={CreateUserForm} />
        <Route exact path="/min-side" component={myPage}/>
        <Route exact path="/logg-inn" component={LoginForm} />
        <Route exact path="/logg-ut" component={Logout}/>
        <Route exact path="/hjem" component={HomePage} />
        <Route exact path="/arrangement/:id" component={EventPage} />
        <Route exact path="/opprett-arrangement" component={AddEvent} />
        <Route exact path="/endre-arrangement" component={EditEvent} />

        <PrivateRoute authed={authService.loggedIn()} path='/private' component={myPage}/>
    </div>
    </BrowserRouter>,
root
);
