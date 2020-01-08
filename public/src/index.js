import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
import { HashRouter, BrowserRouter, Route,  NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { createHashHistory, createBrowserHistory } from 'history';
//import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free";
import {myPage} from '../src/components/mypage.js';
import {navbar} from '../src/components/navbar.js';



//const history = createHashHistory();
const history = createBrowserHistory();
const url = "http://localhost:5001/harmoni-6/us-central1//api/v1/";

class Test extends Component{
    render(){
        return(
            <div>
                <button onClick={test()}>Test webapp</button>
            </div>
        );
    }
}
function test(){
    console.log("Test called");
    fetch(url+"test", {
        method: "GET",
        body: JSON.stringify({ }),
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-access-token': 'undefined',
        }
    })
        .then(res => alert(res.body))
        .catch(err => console.log("error"));
}

const root = document.getElementById('root');
if (root)
    ReactDOM.render(
    <BrowserRouter>
    <div>
        <Route path="/" component={navbar}/>
        <Route exact path="/" component={Test}/>
        <Route path="/min-side" component={myPage}/>
    </div>
    </BrowserRouter>,
root
);