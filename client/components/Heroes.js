import React from "react"
import { connect } from "react-redux"
import Jumbotron from "./Jumbotron"

import { fetchHeroes } from "../actions/Heroes"

require( "../less/Heroes.less" )

@connect( ( store ) => {
	console.log( "store", store )
	return {
		heroes: store.heroes.heroes,
	}
})

export default class Heroes extends React.Component {

	componentWillMount() {
		this.props.dispatch( fetchHeroes( this.props.dispatch ) )
	}

	render() {

		const { heroes } = this.props

		let heroes_html = heroes.map( ( hero, index ) => {
			return (
				<div class="col" key={ index }>
					<h3>
						<a class="btn btn-primary" href={ "/hero/" + hero.name.toLowerCase() } role="button">
							{ hero.name }
						</a>
					</h3>
				</div>
			)
		});

		return (

			<main role="main">

				<Jumbotron title="Heros"></Jumbotron>

				<div class="container">
					<div class="row">
						{ heroes_html }
					</div>

				</div>

			</main>
		)
	}
}