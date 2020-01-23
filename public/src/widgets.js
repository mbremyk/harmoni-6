import {Component} from "react-simplified";
import {Col, Card, Button, Form, Modal} from "react-bootstrap";
import * as React from 'react';
import Row from "react-bootstrap/Row";
import moment from "moment";
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

    getImageOverlayTxt() {
        let now = moment().format('YYYY-MM-DD HH:MM');
        moment(now).add(1, 'h');
        if (moment(now).isAfter(this.props.end_date)) {
            return "Arkivert"
        } else if (this.props.event.cancelled) {
            return "Utgått!";
        } else if (moment(now).isBetween(this.props.start_date, this.props.end_date, null, "[]")) {
            return "Pågår nå!";
        } else return "";
    }

    render() {
        return (
            <Col md={12} lg={4} className={"mt-2 mb-2"} style={{cursor: "pointer"}}>
                <Card onMouseEnter={() => this.setState({hoverCss: "shadow-lg"})}
                      onMouseLeave={() => this.setState({hoverCss: "shadow-sm"})}
                      className={this.state.hoverCss}
                      onClick={() => window.location = "/arrangement/" + this.props.link}
                >
                    <Card className="border-0">
                        <div style={{height: "13em", overflow: "hidden"}}>
                            <Card.Img src={this.props.imageUrl} alt={this.title}/>
                            <Card.ImgOverlay>
                                <Card.Title><h1 className="imageText">{this.getImageOverlayTxt()}</h1></Card.Title>
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
                console.log(response);
                const link = document.createElement('a');
                link.download = response.name;
                link.href = response.data;
                link.click();
            })
            .catch(err => {
                alert(err.toString());
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
        // service.uploadContract(data, eventId, artistId)
        // 	.then(res => console.log(res));
    };

}

export class ModalPopup extends Component {
    state = {
        show: false,
        password: ""
    };

    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: true});
    handlePassword = (event) => this.setState({password: event.target.value});
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({show: false});
        this.props.onClose(this.state.password);
    };

    render() {
        return (
            <>
                <Button variant="danger" onClick={this.handleShow}>
                    Slett bruker
                </Button>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group>
                                <Form.Label>{this.props.label}</Form.Label>
                                <Form.Control value={this.state.password}
                                              type={"password"}
                                              onChange={this.handlePassword}>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type={"button"} variant="secondary" onClick={this.handleClose}>
                            Avbryt
                        </Button>
                        <Button type={"submit"} variant="primary" onClick={this.handleSubmit}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

}

export class MailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipientString: this.getRecipentString(props) ? this.getRecipentString(props) : "",
            description: props.description ? props.description : "",
            text: "",
            mails: this.getAllMails(props) ? this.getAllMails(props) : [],
            hasRecipients: props.hasRecipients ? true : false,
            toggle: false,
            toggleable: props.toggleable ? props.toggleable : false,
            arrow: "▼",
            error: "",
            errorType: ""
        };
    }

    getRecipentString(props) {
        let recipientsString = "";
        console.log(props);
        if (props.recipients) {
            props.recipients.map(user => {
                recipientsString = recipientsString += user.user.email + ", "
            });
        }
        return recipientsString;
    }

    getAllMails(props) {
        let mails = [];
        if (props.recipients) {
            props.recipients.map(user => {
                mails.push(user.user.email);
            });
        }
        return mails;
    }

    handleRecipientChange = (e) => {
        this.setState({recipientString: e.target.value});
    }

    setAlert(message, variant) {
        this.setState({error: message, errorType: variant});
        setTimeout(() => this.setState({error: '', errorType: 'primary'}), 5000);
    }

    handleTextChange = (e) => {
        this.setState({text: e.target.value});
    }

    handleDescriptionChange = (e) => {
        this.setState({description: e.target.value});
    }

    render() {
        if (this.state.toggleable) {
            return (
                <div>
                    <div className={"c-sm "}>
                        <Card className="border-0 m-sm-5 mt-4 p-sm-4">
                            <div>
                                <Button style={{marginBottom: "10px"}} className={"btn-info"} onClick={this.toggleMail}
                                        block>
                                    Send epost {this.state.arrow}
                                </Button>
                                {(this.state.toggle) ? this.toggleForm(this.state.toggle) : <div style={{height: "3em"}}/>}
                            </div>
                        </Card>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className={"container"}>
                        <Card className="m-sm-5 p-sm-4">
                            <div>
                                {this.toggleForm(true)}
                            </div>
                        </Card>
                    </div>
                </div>
            )
        }
    }

    toggleMail(){
        if(this.state.toggle){
            //this.state.toggle = false;
            this.setState({toggle: false });
            this.setState({arrow: "▼"});
            //this.state.arrow = "▼";
        }else{
            //this.state.toggle = true;
            this.setState({toggle: true});

            this.setState({arrow: "▲"});
        }
    }

    toggleForm(on){
        if (on && this.state.hasRecipients) {
            return (
                <Form>
                    <h1 className='h1 text-center'>Send en epost til flere </h1>
                    {(this.state.error) ?
                        <Alert style={{height: '3em'}} variant={this.state.errorType}>{this.state.error}</Alert> :
                        <div style={{height: '3em'}}/>}
                    <Form.Label>Mottaker:</Form.Label>
                    <Form.Control as="textarea" onChange={this.handleRecipientChange} value={this.state.recipientString}
                                  placeholder={"mottakere"} rows="1" style={{display: 'flex'}}/>
                    <Form.Label>Tittel:</Form.Label>
                    <Form.Control as="textarea" value={this.state.description} onChange={this.handleDescriptionChange}
                                  placeholder={"beskrivelse"} rows="2" style={{display: 'flex'}}/>
                    <Form.Label>Innhold:</Form.Label>
                    <Form.Control as="textarea" onChange={this.handleTextChange} placeholder={"tekst"} rows="3"
                                  style={{display: 'flex'}}/>
                    <Button
                        className={"btn-primary mt-2 mr-2"}
                        onClick={() => this.sendMail(false)}>
                        Send Email
                    </Button>
                    <Button
                        className={"btn-secondary mt-2"}
                        onClick={() => this.props.history.pop()}>
                        Avbryt
                    </Button>
                </Form>
            )
        } else if (!on) {
            return null;
        } else {
            return <Form>
                <h1 className='h1 text-center'>Send en epost </h1>
                {(this.state.error) ?
                    <Alert style={{height: '3em'}} variant={this.state.errorType}>{this.state.error}</Alert> :
                    <div style={{height: '3em'}}/>}
                <Form.Label>Tittel:</Form.Label>
                <Form.Control as="textarea" value={this.state.description} onChange={this.handleDescriptionChange}
                              placeholder={"beskrivelse"} rows="2" style={{display: 'flex'}}/>
                <Form.Label>Innhold:</Form.Label>
                <Form.Control as="textarea" onChange={this.handleTextChange} placeholder={"tekst"} rows="3"
                              style={{display: 'flex'}}/>
                <Button
                    className={"btn-primary mt-2 mr-2"}
                    onClick={() => this.sendMail(true)}>
                    Send Email
                </Button>
                <Button
                    className={"btn-secondary mt-2"}
                    onClick={() => {
                        let path = authService.loggedIn()? '/hjem' : '/';
                        window.location = path;
                    }}>
                    Avbryt
                </Button>
            </Form>
        }
    }

    getUser() {
        let token = jwt.decode(authService.getToken());
        // console.log(token);
        if (!token) {
            this.setAlert("ERROR", "danger");
            return undefined;
        } else {
            return token;
        }
    }

    sendMail(bug) {
        console.log("Sendmail called");
        //let bug = false;
        let user = this.getUser();
        if (bug) {
            if (!user) {
                let userMail = "anon@UwU.com";
                let mail = new BugMail(userMail, "anonymous", this.state.description, this.state.text);
                service.sendBug(mail)
                    .then(res => (this.setAlert(res.toString(), "info")))
                    .catch(err => this.setAlert(err.toString(), "danger"));
            } else {
                let mail = new BugMail(user.email, "anonymous", this.state.description, this.state.text);
                service.sendBug(mail)
                    .then(res => (this.setAlert(res.toString(), "info")))
                    .catch(err => this.setAlert(err.toString(), "danger"));
            }
        } else {
            if (!user) {
                this.setAlert("NOT LOGGED IN", "danger");
            }
            let to = [];
            this.state.mails.map(address => {
                if (this.state.recipientString.search(address) !== -1) {
                    to.push(address);
                }
            });
            let mail = new Mail(to, user.email, user.username, this.state.description, this.state.text);
            console.log(this.state.mails);
            console.log("Recipients");
            console.log(mail);
            service.sendMails(mail)
                .then(res => (this.setAlert(res.toString(), "info")))
                .catch(err => this.setAlert(err.toString(), "danger"))
        }
    }
}