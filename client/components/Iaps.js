import React from "react"
import { connect } from "react-redux"
import Jumbotron from "./Jumbotron"

import { fetchIaps } from "../actions/Iaps"

require( "../less/Iaps.less" )

@connect( ( store ) => {
	console.log( "store", store )
	return {
		iaps: store.iaps.iaps,
	}
})

export default class Iaps extends React.Component {

	componentWillMount() {
		this.props.dispatch( fetchIaps( this.props.dispatch ) )
	}

	render() {

		const { iaps } = this.props;

		let iaps_html = iaps.map( ( iap, index ) => {
			return (
				<div class="col" key={ index }>
					<h3>
						<a class="btn btn-primary" href={ "/iap/" + iap.name } role="button">
							{ iap.name }
						</a>
					</h3>
				</div>
			)
		});

		return (

			<main role="main">

				<Jumbotron title="In-App Purchases"></Jumbotron>

				<div class="container">
					<div class="row">
						{ iaps_html }
					</div>

				</div>

			</main>
		)
	}
}