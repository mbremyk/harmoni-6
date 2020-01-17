import {Component} from "react-simplified";
import {Col, Card, Button} from "react-bootstrap";
import * as React from 'react';
import Row from "react-bootstrap/Row";


import {service} from "./services";

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


    /*<div className="font-weight-bold">
     Pris fra
     </div>
     {this.props.price}*/

    getCancelled() {
        if (this.props.event.cancelled) return "Kansellert!";
        else return "";
    }

    render() {
        if (this.props.myEvent) {
            return (


                <Col md={12} lg={4}>


                    <Card>

                        <div className="eventinfo">
                            <a href={"/arrangement/" + this.props.link}>
                                <Card className="text-danger">
                                    <Card.Img src={this.props.imageUrl} alt={this.title} />
                                    <Card.ImgOverlay>
                                        <Card.Title><h1>{this.getCancelled()}</h1></Card.Title>
                                    </Card.ImgOverlay>
                                </Card>
                            </a>
                        </div>
                        <Card.Body>


                            <div className="eventinfo">
                                <a href={"/arrangement/" + this.props.link}>

                                    <Card.Title>{this.props.title}</Card.Title>
                                    <Card.Text>
                                        <div className="font-weight-bold ">
                                            Adresse
                                        </div>
                                        {this.props.address}

                                        <div className="font-weight-bold">
                                            Aldersgrense
                                        </div>
                                        <div className="font-italic">
                                            {this.props.age_limit}
                                        </div>
                                        <div className="font-weight-bold">
                                            Fra
                                        </div>

                                        {this.props.start_date}

                                        <div className="font-weight-bold">
                                            Til
                                        </div>

                                        {this.props.end_date}

                                    </Card.Text>

                                </a>
                            </div>

                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                <Col>
                                    <small className="text-muted"> Publisert {this.props.uploaded}</small>
                                </Col>
                                <Col>
                                    <Button href={"/endre-arrangement/" + this.props.link} variant="primary" size="sm">Rediger
                                        Arragement</Button>
                                </Col>
                            </Row>

                        </Card.Footer>
                    </Card>


                </Col>


            );


        } else {
            return (

                <Col md={12} lg={4}>




                    <Card>
                        {/*<Card.Img variant="top"
                                  src={this.props.imageUrl}
                                  alt={this.title}/>*/}
                        <Card className="text-danger">
                            <Card.Img src={this.props.imageUrl} alt={this.title} />
                            <Card.ImgOverlay>
                                <Card.Title><h1>{this.getCancelled()}</h1></Card.Title>
                            </Card.ImgOverlay>
                        </Card>
                        <Card.Body>


                            <Card.Title>{this.props.title}</Card.Title>
                            <Card.Text>
                                <div className="font-weight-bold ">
                                    Adresse
                                </div>
                                {this.props.address}

                                <div className="font-weight-bold">
                                    Aldersgrense
                                </div>
                                <div className="font-italic">
                                    {this.props.age_limit}
                                </div>
                                <div className="font-weight-bold">
                                    Fra
                                </div>

                                {this.props.start_date}

                                <div className="font-weight-bold">
                                    Til
                                </div>

                                {this.props.end_date}

                            </Card.Text>

                            <a href={"/arrangement/" + this.props.link} className="stretched-link"></a>


                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted"> Publisert {this.props.uploaded}</small>
                        </Card.Footer>
                    </Card>


                </Col>
            );
        }


    }
}

export class DownloadWidget extends Component  {
    //TODO: Add event keys to fetch correct contract/rider
    artist = 1;
    event = 1;
    type = "";
    render() {
        return (
            <Button onClick={this.download} variant="link" aria-label="Left Align" title="Last Ned">
                last ned {this.type}
            </Button>
        )
    }

    mounted() {
        this.artist = this.props.artist;
        this.event = this.props.event;
        this.type = this.props.type;
    }


    download () {
        /*let eventId = this.e.eventId;
        let artistId = this.artist.userId;*/
        //let artistId = 1;
        //console.log(this.artists[0].username);
        console.log(this.artist);
        if(this.type == "kontrakt") {
            service.downloadContract(this.event, this.artist)
                .then(response => {
                    console.log("INNI Promise");
                    console.log("response: "+response);
                    let fileName = response.name;
                    const link = document.createElement('a');
                    link.download = response.name;
                    //let ret = response.data.replace('data:text/plain;base64,', 'data:application/octet-stream;base64,');
                    //console.log(ret);
                    link.href = response.data;
                    link.click();
                })
        }else if(this.type == "rider"){
            service.downloadRider(this.event, this.artist)
                .then(response => {
                    console.log("INNI Promise");
                    console.log("response: "+response);
                    let fileName = response.name;
                    const link = document.createElement('a');
                    link.download = response.name;
                    //let ret = response.data.replace('data:text/plain;base64,', 'data:application/octet-stream;base64,');
                    //console.log(ret);
                    link.href = response.data;
                    link.click();
                })
        }else{
            service.downloadOther(this.event, this.artist)
                .then(response => {
                    console.log("INNI Promise");
                    console.log("response: "+response);
                    let fileName = response.name;
                    const link = document.createElement('a');
                    link.download = response.name;
                    //let ret = response.data.replace('data:text/plain;base64,', 'data:application/octet-stream;base64,');
                    //console.log(ret);
                    link.href = response.data;
                    link.click();
                })
        }

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
		let eventId = 2;
		let artistId = 5;
		e.preventDefault();
		let selectedFile =  e.target.files[0];
		let data = new FormData();
		data.append("file", selectedFile);
		console.log(data);
		service.uploadContract(data, eventId, artistId)
			.then(res => console.log(res));
	};

}
