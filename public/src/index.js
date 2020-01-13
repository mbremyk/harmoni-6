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
import {HarmoniNavbar} from "./components/harmoniNavbar.js";
import {myPage} from "./components/mypage.js";
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import {addEvent} from '../src/components/createevent.js';
import AuthService from "./AuthService";
import {HomePage} from "./components/homepage";
import{EventPage} from "./components/eventpage";
import {EditEvent} from "./components/editevent";
import {AddEvent} from "./components/createevent";

//const history = createHashHistory();
const history = createBrowserHistory();
const url = "http://localhost:5001/harmoni-6/us-central1/webApi/api/v1/";

const root = document.getElementById('root');
if (root)
    ReactDOM.render(
    <BrowserRouter>
    <div>
        <HarmoniNavbar/>
        {/*<Route path="/" component={harmoniNavbar}/>*/}
        <Route exact path="/" component={LandingPage}/>
        <Route exact path="/ny-bruker" component={CreateUserForm} />
        <Route exact path="/min-side" component={myPage}/>
        <Route exact path="/logg-inn" component={LoginForm} />
        <Route exact path="/hjem" component={HomePage} />
        <Route exact path="/arrangement/:id" component={EventPage} />
        <Route exact path="/opprett-arrangement" component={AddEvent} />
        <Route exact path="/endre-arrangement/:id" component={EditEvent} />

    </div>
    </BrowserRouter>,
root
);

/*
const GuardProvider = require('react-router-guards').GuardProvider;
const GuardedRoute = require('react-router-guards').GuardedRoute;

const App = () => (
  <Router history={history}>
    <GuardProvider loading={Loading} error={NotFound}>
      <GuardedRoute path="/login" exact component={Login} />
      <GuardProvider guards={[requireLogin]}>
        <GuardedRoute path="/" exact component={Home} />
        <GuardedRoute path="/about" exact component={About} />
      </GuardProvider>
      <GuardedRoute path="*" component={NotFound} />
    </GuardProvider>
  </Router>
);
 */