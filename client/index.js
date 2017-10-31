import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { BrowserRouter as Router, Route, browserHistory, Switch, Redirect } from "react-router-dom"

import Splash from "./components/Splash"
import TopNav from "./components/TopNav"
import Footer from "./components/Footer"
import Heroes from "./components/Heroes"
import Hero from "./components/Hero"
import Skins from "./components/Skins"

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
						<Route path="/heroes" exact component={ Heroes } />
						<Route path="/hero/:heroName" exact component={ Hero } />
						<Route path="/hero" exact component={ Hero } />
						<Route path="/skins" exact component={ Skins } />
					</Switch>
					<Footer />
				</div>
			</Router>
		</Provider>
	</div>
, app )