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

		let heroes_html = heroes.sort( ( a, b ) => {
			return ( a.name < b.name ) ? -1 : ( b.name > a.name ) ? 1 : 0;
		}).map( ( hero, index ) => {
			return (
				<a class="btn btn-primary" href={ "/hero/" + hero.name.toLowerCase() } role="button">
					{ hero.name }
				</a>
			)
		});

		return (

			<main role="main">

				<Jumbotron title="Heros"></Jumbotron>

				<div class="container">
					<div class="col">
						<div class="btn-group-vertical">
							{ heroes_html }
						</div>
					</div>
				</div>

			</main>
		)
	}
}