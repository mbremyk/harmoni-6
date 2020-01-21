import {Component} from "react-simplified";
import {Col, Card, Button, Form} from "react-bootstrap";
import * as React from 'react';
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import {BugMail, Mail, service} from "./services";
import {authService} from "./AuthService";

const jwt = require("jsonwebtoken");


export class EventInfo extends Component {
    event;
    imageUrl;
    title;
    address;
    price;
    age_limit;
    start_date;
    end_date;
    uploaded;
    link;
    myEvent;

    state = {
        hoverCss: "shadow-sm"
    };


    /*<div className="font-weight-bold">
     Pris fra
     </div>
     {this.props.price}*/

    getAgeLimitInfo(age_limit) {
        if (age_limit !== 0) {
            return <div>
                <b>Aldersgrense:</b> {age_limit}
            </div>
        } else {
            return <div className="font-weight-bold">
                Tillat For Alle
            </div>
        }
    }

    getCardFooter(myEvent) {
        if (myEvent) {
            return <Row>
                <Col>
                    <small className="text-muted"> Publisert {this.props.uploaded}</small>
                </Col>
                <Col>
                    <Button href={"/endre-arrangement/" + this.props.link} variant="primary" size="sm">Rediger
                        Arragement</Button>
                </Col>
            </Row>
        } else return <small className="text-muted"> Publisert {this.props.uploaded}</small>
    }

    getCancelledTxt() {
        if (this.props.event.cancelled) return "Kansellert!";
        else return "";
    }

    render() {
        return (
            <Col md={12} lg={4} className={"mt-2 mb-2"} style={{cursor: "pointer"}}>
                <Card onMouseEnter={() => this.setState({hoverCss: "shadow-lg"})}
                      onMouseLeave={() => this.setState({hoverCss: "shadow-sm"})}
                      className={this.state.hoverCss}
                      onClick={() => window.location = "/arrangement/" + this.props.link}
                >
                    <Card className="text-danger border-0">
                        <div style={{height: "13em", overflow: "hidden"}}>
                            <Card.Img src={this.props.imageUrl} alt={this.title}/>
                            <Card.ImgOverlay>
                                <Card.Title><h1>{this.getCancelledTxt()}</h1></Card.Title>
                            </Card.ImgOverlay>
                        </div>
                    </Card>
                    <Card.Body>
                        <div className="eventinfo">
                            <Card.Title>{this.props.title}</Card.Title>
                            <Card.Text>
                                <div className="font-weight-bold ">
                                    Adresse
                                </div>
                                {this.props.address}
                                {this.getAgeLimitInfo(this.props.age_limit)}
                                <div className="font-weight-bold">
                                    Fra
                                </div>
                                {this.props.start_date}
                                <div className="font-weight-bold">
                                    Til
                                </div>
                                {this.props.end_date}
                            </Card.Text>
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        {this.getCardFooter(this.props.myEvent)}
                    </Card.Footer>
                </Card>
            </Col>
        );
    }
}

export class DownloadWidget extends Component {
    artist = '';
    event = '';

    render() {
        return (
            <Button onClick={this.download} variant="primary" title="Last Ned" size="sm">
                Last ned kontrakt
            </Button>
        )
    }

    mounted() {
        this.artist = this.props.artist;
        this.event = this.props.event;
    }


    download() {
        service
            .downloadContract(this.event, this.artist)
            .then(response => {
                const link = document.createElement('a');
                link.download = response.name;
                link.href = response.data;
                link.click();
            })
    };
}

export class UploadWidget extends Component {
    render() {
        return (
            <div className="container">
                <div className="form-group files color">
                    <label>Upload Your File </label>
                    <input type="file" className="form-control" encType="multipart/form-data" name="file"
                           onChange={this.fileHandler}/>
                </div>
            </div>
        )
    }

    fileHandler = (e) => {
        e.preventDefault();
        let selectedFile = e.target.files[0];
        let data = new FormData();
        data.append("file", selectedFile);
        console.log(data);
    };

    /*recipients(){
        if(this.props.hasRecipients){
            return(
                <Form.Control as="textarea" onChange={this.handleRecipientChange} value={this.recipientString} placeholder={"mottakere"} rows="1" style={{display: 'flex'}}/>
            )
        }else{
            return null;
        }

    }*/

    toggleForm(on){
        console.log(this.state.hasRecipients);
        console.log(this.state.description);
        if(on && this.state.hasRecipients){
            return (
                <Form style={{marginTop: "10px"}}>
                    <h1>Send en epost til flere </h1>
                    <Form.Control as="textarea" onChange={this.handleRecipientChange} value={this.state.recipientString} placeholder={"mottakere"} rows="1" style={{display: 'flex'}}/>
                    <Form.Control as="textarea" value={this.state.description} onChange={this.handleDescriptionChange}  placeholder={"beskrivelse"} rows="2" style={{display: 'flex'}}/>
                    <Form.Control as="textarea" onChange={this.handleTextChange} placeholder={"tekst"} rows="3" style={{display: 'flex'}}/>
                    <Button style={{marginTop: "10px"}} className={"btn-primary"} onClick={() => this.sendMail(false)} block>Send Email</Button>
                </Form>
            )
        }else if(!on){
            return null;
        }else{
           return <Form style={{marginTop: "10px"}}>
                <h1>Send en epost </h1>
                <Form.Control as="textarea" value={this.state.description} onChange={this.handleDescriptionChange}  placeholder={"beskrivelse"} rows="2" style={{display: 'flex'}}/>
                <Form.Control as="textarea" onChange={this.handleTextChange} placeholder={"tekst"} rows="3" style={{display: 'flex'}}/>
                <Button style={{marginTop: "10px"}} className={"btn-primary"} onClick={() => this.sendMail(true)} block>Send Email</Button>
            </Form>
        }

    }

    getUserEmail() {
        let token = jwt.decode(authService.getToken());
        if (!token.email) {
            return token.email;
        }else{
            this.setAlert("ERROR", "danger");
            return undefined
        }
    }

    sendMail(bug){
        console.log("Sendmail called");
        //let bug = false;
        let userMail = this.getUserEmail();
        if(bug){
            if(!userMail){
                let userMail = "anon UwU";
            }
            let mail = new BugMail(userMail, this.state.description, this.state.text);
           service.sendBug(mail)
                .then(res => (this.setAlert(res.toString(), "info")))
                .catch(err => this.setAlert(err.toString(), "danger"));
        }else{
            if(!userMail){
                this.setAlert("NOT LOGGED IN", "danger");
            }
            let to = [];
            this.state.mails.map(address => {
                if(this.state.recipientString.search(address) !== -1){
                    to.push(address);
                }
            });
            console.log(to);
            let mail = new Mail(to, userMail, this.state.description, this.state.text);
            service.sendMails()
                .then(res => (this.setAlert(res.toString(), "info")))
                .catch(err => this.setAlert(err.toString(), "danger"))
        }
    }

   /* yo(){
        <Form style={{marginTop: "10px"}}>
            <form value={this.description} as="textarea"  placeholder={"beskrivelse"}
                  rows="2" style={{display: 'flex'}}
                  onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.description = event.target.value)}>
                <Form.Control as="textarea"  placeholder={"beskrivelse"}
                              rows="2" style={{display: 'flex'}}/>
            </form>
            <form
                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.text = event.target.value)}>
                <Form.Control as="textarea" placeholder={"tekst"} rows="3" style={{display: 'flex'}}/>
            </form>
            <Button className={"btn-primary"} onClick={this.sendMail}>Send Email</Button>
        </Form>
    }*/

    /*mounted(){
        if(this.props.description){
            this.description = this.props.description
        }else if(this.props.hasRecipients){
            console.log("in Mounted"+this.props.hasRecipients);
            this.hasRecipients = this.props.hasRecipients
        }
        this.props.artists.map(user => {
            this.recipientString+=user.email+", ";
            this.mails.push(user.email);
        });

    }*/

}


