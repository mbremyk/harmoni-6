import {Component} from "react-simplified";
import {Col, Card, Button} from "react-bootstrap";
import * as React from 'react';
import Row from "react-bootstrap/Row";





export class EventInfo extends Component
{
	imageUrl;
	title;
	address;
	price;
	age_limit;
	start_date;
	end_date;
	uploaded;
	link;

	/*<div className="font-weight-bold">
	 Pris fra
	 </div>
	 {this.props.price}*/

	render()
	{
		if (this.props.myEvent)
		{
			return (


					<Col md={12} lg={4}>


						<Card>

							<div className="eventinfo">
							<a href={"/arrangement/" + this.props.link}>
								<Card.Img variant="top"
								          src={this.props.imageUrl}
								          alt={this.title}/>
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
										<Button href={"/endre-arrangement/"  + this.props.link} variant="primary" size="sm">Rediger Arragement</Button>
									</Col>
								</Row>

							</Card.Footer>
						</Card>


					</Col>



			);


		}
		else
		{
			return (

				<Col md={12} lg={4}>


					<Card>
						<Card.Img variant="top"
						          src={this.props.imageUrl}
						          alt={this.title}/>
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
