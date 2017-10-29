import React from "react"
import { connect } from "react-redux"
import Dygraph from "dygraphs";

import { fetchHero } from "../actions/Hero"

require( "../less/Hero.less" )

@connect( ( store ) => {
	console.log( "store", store )
	return {
		hero: store.hero.hero,
	}
})

export default class Hero extends React.Component {

	componentWillMount() {
		console.log( "Hero" )
		this.props.dispatch( fetchHero( this.props.dispatch ) )
	}

	componentDidMount() {
		function add_date( minutes ) {
			let d = new Date();
				d.setMinutes( d.getMinutes() + minutes );
			return d;
		}
		let graph_data = [
			[ new Date(), 5 ],
			[ add_date( 5 ), 50 ],
			[ add_date( 10 ), 40 ],
			[ add_date( 15 ), 6 ],
		];
		console.log( graph_data )
		new Dygraph( document.getElementById( "graph" ), graph_data );
	}

	render() {

		const { hero } = this.props

		return (

			<main role="main">

				<div class="container">
					<h1 class="">Heroes</h1>
				</div>

				<div class="container">
					<div id="graph"></div>
				</div>

			</main>
		)
	}
}