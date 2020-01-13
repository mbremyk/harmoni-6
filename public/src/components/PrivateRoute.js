import Redirect from "react-router-dom/es/Redirect";
import React from "react";
import Route from "react-router-dom/es/Route";

export function PrivateRoute ({component: Component, authed, ...rest}) {
	return (
		<Route
			{...rest}
			render={(props) => authed === true
				? <Component {...props} />
				: <Redirect to={{pathname: '/logg-inn', state: {from: props.location}}} />}
		/>
	)
}