import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
import { HashRouter, BrowserRouter, Route,  NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { createHashHistory, createBrowserHistory } from 'history';
//import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free"
import {CreateUserForm} from '../src/components/createuser';
import {LandingPage} from "./components/frontpage";
import {LoginForm} from "./components/login";
import {navbar} from "./components/navbar.js";
import {myPage} from "./components/mypage.js";
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import {addEvent} from '../src/components/createevent.js';

//const history = createHashHistory();
const history = createBrowserHistory();
const url = "http://localhost:5001/harmoni-6/us-central1/webApi/api/v1/";

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
        <Route exact path="/opprett-arrangement" component={addEvent} />
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