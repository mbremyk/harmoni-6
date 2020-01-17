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

export class DownloadWidget extends Component {
    //TODO: Add event keys to fetch correct contract/rider
    render() {
        return (
            <button onClick={this.download}>Download the file</button>
        )
    }

	download(){
		//For the time being this only fetches the file with the 1-1 key.
		//window.location.href="http://localhost:5001/harmoni-6/us-central1/webApi/api/v1/contract/1/1";
		let eventId = 2;
		let artistId = 5;
		service.downloadContract(eventId, artistId)
			.then( response => {
				console.log(response);
				let fileName = response.name;
				const link = document.createElement('a');
				link.download = response.name;
				link.href = 'data:application/octet-stream;base64,'+response.data;
				link.click();
		})

	}
	/*b64toBlob (b64Data, contentType='', sliceSize=512) {
		const byteCharacters = atob(b64Data);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, {type: contentType});
		return blob;
	}*/
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
        let selectedFile = e.target.files[0];
        let data = new FormData();
        data.append("file", selectedFile);
        console.log(data);
        // service.uploadContract(data, eventId, artistId)
        // 	.then(res => console.log(res));
    };

}
