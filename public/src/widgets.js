import {Component} from "react-simplified";
import {Col,Card} from "react-bootstrap";
import * as React from 'react';
import {service} from "./services";


export class EventInfo extends Component
{
	image;
	title;
	adress;
	price;
	age_limit;
	start_date;
	end_date;
	uploaded;

	render()
	{
		return (

			<Col md={12} lg={4}>


				<Card>
					<Card.Img variant="top"
					          src={this.props.image}/>
					<Card.Body>


						<Card.Title>{this.props.title}</Card.Title>
						<Card.Text>
							<div className="font-weight-bold ">
								Adresse
							</div>
							{this.props.adress}


							<div className="font-weight-bold">
								Pris
							</div>
							{this.props.price}


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


					</Card.Body>
					<Card.Footer>
						<small className="text-muted"> Publisert {this.props.uploaded}</small>
					</Card.Footer>
				</Card>


			</Col>



		);
	}
}

export class DownloadWidget extends Component{
	//TODO: Add event keys to fetch correct contract/rider
	render (){
		return(
			<button onClick={this.download}>Download the file</button>
		)
	}

	download(){
		//For the time being this only fetches the file with the 1-1 key.
		window.location.href="http://localhost:5001/harmoni-6/us-central1/webApi/api/v1/contract/1/1";
	}
}

export class UploadWidget extends Component{
	//TODO: Make sexy
	render(){
		return(
			<div className="container">
				<div className="row">
					<div className="col-md-6">
						<div className="form-group files color">
							<label>Upload Your File </label>
							<input type="file" className="form-control" encType="multipart/form-data" name="file" onChange={this.fileHandler}/>
						</div>
					</div>
				</div>
			</div>
		)
	}

	fileHandler = (e) => {
		e.preventDefault();
		let selectedFile =  e.target.files[0];
		let data = new FormData();
		data.append("file", selectedFile);
		console.log(data);
		service.uploadContract(data, 1, 1)
			.then(res => console.log(res));
	};

}
