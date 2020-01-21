import * as React from 'react';
import {Router, Route, BrowserRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import "@fortawesome/fontawesome-free"
import {CreateUserForm} from '../src/components/createuser';
import {LandingPage} from "./components/landingpage";
import {LoginForm} from "./components/login";
import {myPage} from "./components/mypage.js";
import {AddEvent} from './components/createevent.js';
import {HomePage} from "./components/homepage";
import {EventPage} from "./components/eventpage";
import {Logout} from './components/logout'
import {EditEvent} from "./components/editevent";
import {UploadWidget, DownloadWidget, MailForm} from "./widgets";
import {Footer} from "./components/footer";
import {authService} from "./AuthService";
import {PrivateRoute} from "./components/PrivateRoute";
import {SearchResults} from "./components/searchresults";
import {createBrowserHistory} from "history";
import {NewPassword} from "./components/newpassword";
import {RiderPage, Riderpage} from "./components/riderpage";

const history = createBrowserHistory();
const url = "http://localhost:5001/harmoni-6/us-central1/webApi/api/v1/";

const root = document.getElementById('root');
if (root)
    ReactDOM.render(
    <BrowserRouter history={history}>
        <Route exact path="/" component={LandingPage}/>
        <Route exact path="/bugs" component={() => <MailForm toggleable={false} description={"Jeg har en bug"} hasRecipients={false}/>}/>
        <Route exact path="/ny-bruker" component={CreateUserForm}/>
        <Route exact path="/arrangement/:id" component={EventPage}/>
        <Route exact path="/logg-inn" component={LoginForm}/>
        <Route exact path="/nytt-passord" component={NewPassword}/>
        <Route exact path="/sok/:input" component={SearchResults}/>

        <PrivateRoute authed={authService.loggedIn()} exact path="/min-side" component={myPage}/>
        <PrivateRoute authed={authService.loggedIn()} exact path="/logg-ut" component={Logout}/>
        <PrivateRoute authed={authService.loggedIn()} exact path="/hjem" component={HomePage}/>
        <PrivateRoute authed={authService.loggedIn()} exact path="/opprett-arrangement" component={AddEvent}/>
        <PrivateRoute authed={authService.loggedIn()} exact path="/endre-arrangement/:id" component={EditEvent}/>
        <PrivateRoute authed={authService.loggedIn()} exact path="/Upload" component={UploadWidget}/>
        <PrivateRoute authed={authService.loggedIn()} exact path="/Upload" component={DownloadWidget}/>
        <PrivateRoute authed={authService.loggedIn()} exact path="/arrangement/:id/legg-til-rider" component={RiderPage}/>

        <Route path='/' component={Footer}/>

    </BrowserRouter>,
    root
);
