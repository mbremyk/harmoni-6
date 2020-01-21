import {Component} from "react-simplified";
import {Button, Card, Col} from "react-bootstrap";
import * as React from 'react';
import Row from "react-bootstrap/Row";
import moment from "moment";


import {service} from "./services";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

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
        if (this.props.event.cancelled) {return "Utgått!";}
        else if (moment(now).isBetween(this.props.start_date, this.props.end_date, null, "[]")){return "Pågår nå!";}
        else if(moment(now).isAfter(this.props.end_date)){return "Arkivert"}
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
                    <Card className="text-warning border-0">
                        <div style={{height: "13em", overflow: "hidden"}}>
                            <Card.Img src={this.props.imageUrl} alt={this.title}/>
                            <Card.ImgOverlay>
                                <Card.Title><h1>{this.getImageOverlayTxt()}</h1></Card.Title>
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
        this.type = this.props.type;
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
    //TODO: Make sexy
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
