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
import Skin from "./components/Skin"
import Bundles from "./components/Bundles"
import Bundle from "./components/Bundle"
import Iaps from "./components/Iaps"
import Iap from "./components/Iap"
import Actions from "./components/Actions"
import Action from "./components/Action"
import Boosts from "./components/Boosts"
import Boost from "./components/Boost"

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
						<Route path="/skin/:skinName" exact component={ Skin } />
						<Route path="/bundles" exact component={ Bundles } />
						<Route path="/bundle/:bundleName" exact component={ Bundle } />
						<Route path="/iaps" exact component={ Iaps } />
						<Route path="/iap/:iapName" exact component={ Iap } />
						<Route path="/actions" exact component={ Actions } />
						<Route path="/action/:actionName" exact component={ Action } />
						<Route path="/boosts" exact component={ Boosts } />
						<Route path="/boost/:boostName" exact component={ Boost } />
					</Switch>
					<Footer />
				</div>
			</Router>
		</Provider>
	</div>
, app )