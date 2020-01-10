import {Component} from "react-simplified";
import {Col,Card} from "react-bootstrap";
import * as React from 'react';


export class EventInfo extends Component
{
	image;
	title;
	address;
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
					          src={this.props.image}
					          alt={this.title}/>
					<Card.Body>


						<Card.Title>{this.props.title}</Card.Title>
						<Card.Text>
							<div className="font-weight-bold ">
								Adresse
							</div>
							{this.props.address}


							<div className="font-weight-bold">
								Pris fra
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
