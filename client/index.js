import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { BrowserRouter as Router, Route, browserHistory, Switch, Redirect } from "react-router-dom"

import Splash from "./components/Splash"
import TopNav from "./components/TopNav"
import HeroesPricesAll from "./components/HeroesPricesAll"

import store from "./store"

const app = document.getElementById( "app" );

ReactDOM.render(
	<div>
		<Provider store={ store }>
			<Router history={ browserHistory }>
				<div>
					<TopNav />
					<Switch>
						<Route path="/" exact component={ Splash } />
						<Route path="/heroes" exact component={ HeroesPricesAll } />
					</Switch>
				</div>
			</Router>
		</Provider>
	</div>
, app )