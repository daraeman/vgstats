import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { BrowserRouter as Router, Route, browserHistory, Switch, Redirect } from "react-router-dom"

import Splash from "./components/Splash"
//import Store from "./components/Store"
//import store from "./store"

const app = document.getElementById( "app" );

ReactDOM.render(
	<div>
		<Router history={ browserHistory }>
			<div>
				<Switch>
					<Route path="/" exact component={ Splash } />
				</Switch>
			</div>
		</Router>
	</div>
, app )