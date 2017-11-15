import React from "react"
import { connect } from "react-redux"
import Jumbotron from "./Jumbotron"

import { fetchBoosts } from "../actions/Boosts"

require( "../less/Boosts.less" )

@connect( ( store ) => {
	console.log( "store", store )
	return {
		boosts: store.boosts.boosts,
	}
})

export default class Boosts extends React.Component {

	componentWillMount() {
		this.props.dispatch( fetchBoosts( this.props.dispatch ) )
	}

	render() {

		const { boosts } = this.props;

		let boosts_html = boosts.map( ( boost, index ) => {
			return (
				<div class="col" key={ index }>
					<h3>
						<a class="btn btn-primary" href={ "/boost/" + boost.name.toLowerCase() } role="button">
							{ boost.name }
						</a>
					</h3>
				</div>
			)
		});

		return (

			<main role="main">

				<Jumbotron title="Boosts"></Jumbotron>

				<div class="container">
					<div class="row">
						{ boosts_html }
					</div>

				</div>

			</main>
		)
	}
}