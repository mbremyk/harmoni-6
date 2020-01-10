import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
import { HashRouter, BrowserRouter, Route,  NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { createHashHistory, createBrowserHistory } from 'history';
import { service } from "./services.js";
//import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free"
import {CreateUserForm} from '../src/components/createuser';
import {LandingPage} from "./components/frontpage";
import {LoginForm} from "./components/login";
import {navbar} from "./components/navbar.js";
import {myPage} from "./components/mypage.js";
import {addEvent} from '../src/components/createevent.js';

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

class UploadWidget extends Component{
    curFile;
    render(){
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group files color">
                            <label>Upload Your File </label>
                            <input type="file" className="form-control" name="file" onChange={this.fileHandler}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    fileHandler = (e) => {
        e.preventDefault();
        let selectedFile =  e.target.files[0];
        //console.log(selectedFile);
        const formData = new FormData();
        formData.append('file', selectedFile);
        const reader = new FileReader();
        let send;
        //send = selectedFile.toDataURL("text/txt");
        selectedFile.arrayBuffer().then(readRes => {
            console.log(readRes);
            service.uploadFile(readRes)
                .then(res => console.log(res));
        });
        //console.log(formData);
    };
}


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


    <Route exact path="/Upload" component={UploadWidget} />
    <Route exact path="/opprett-arrangement" component={addEvent} />
    </div>
    </BrowserRouter>,
root
);