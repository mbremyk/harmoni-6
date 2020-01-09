import {Component} from "react-simplified";
import {Container, Row, Col, Button, Form} from "react-bootstrap";
import {EventInfo} from '../widgets.js';
import {createHashHistory} from 'history';
import * as React from 'react';


export class LandingPage extends Component
{
	events;

	render()
	{
		return (

			<div>

				<div className="landingpage">

					<Container>


						<Row>
							<Col md={{span: 3, offset: 5}}>
								<h1> Harmoni </h1>
							</Col>
						</Row>

						<Row>
							<Col md={{span: 3, offset: 5}}>
								<Button variant="primary"
								        size="lg"
								        onClick={() => this.logIn()} href="logg-inn">Logg inn</Button>
							</Col>

						</Row>
					</Container>

				</div>


				<Container>
					<Row>
						<Col>

							<Form.Control placeholder="Søk etter arragement"/>

						</Col>
					</Row>

				</Container>


				<Container>


					<Row>




						<EventInfo
							image="https://m.baerumkulturhus.no/sites/default/files/styles/mobile_event_722x418_/public/191012_hakkebakkeskogen.jpg?itok=JC_cgMkB"
							title="Bamse har show"
							adress="Hakkebakkeskogen 23"
							price="20kr"
							age_limit="18+"
							start_date="1 Februar 2020 20:00"
							end_date="1 Februar 2020 22:00"

						/>

						<EventInfo
							image="https://m.baerumkulturhus.no/sites/default/files/styles/mobile_event_722x418_/public/191012_hakkebakkeskogen.jpg?itok=JC_cgMkB"
							title="Bamse har show"
							adress="Hakkebakkeskogen 23"
							price="20kr"
							age_limit="18+"
							start_date="1 Februar 2020 20:00"
							end_date="1 Februar 2020 22:00"

						/>

						<EventInfo
							image="https://m.baerumkulturhus.no/sites/default/files/styles/mobile_event_722x418_/public/191012_hakkebakkeskogen.jpg?itok=JC_cgMkB"
							title="Bamse har show"
							adress="Hakkebakkeskogen 23"
							price="20kr"
							age_limit="18+"
							start_date="1 Februar 2020 20:00"
							end_date="1 Februar 2020 22:00"

						/>

						<EventInfo
							image="https://m.baerumkulturhus.no/sites/default/files/styles/mobile_event_722x418_/public/191012_hakkebakkeskogen.jpg?itok=JC_cgMkB"
							title="Bamse har show"
							adress="Hakkebakkeskogen 23"
							price="20kr"
							age_limit="18+"
							start_date="1 Februar 2020 20:00"
							end_date="1 Februar 2020 22:00"

						/>

					</Row>
				</Container>
			</div>

		);

	}

	mounted()
	{
		/*service
			.getEvents()
			.then(events => (this.events = Array.from(events)))
			.catch((error) => Alert.danger(error.message));*/



	}

	logIn()
	{
		//history.push('/logg-inn');

	}

}
