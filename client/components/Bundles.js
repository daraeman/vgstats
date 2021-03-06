import React from "react"
import { connect } from "react-redux"
import Jumbotron from "./Jumbotron"

import { fetchBundles } from "../actions/Bundles"

require( "../less/Bundles.less" )

@connect( ( store ) => {
	console.log( "store", store )
	return {
		bundles: store.bundles.bundles,
	}
})

export default class Bundles extends React.Component {

	componentWillMount() {
		this.props.dispatch( fetchBundles( this.props.dispatch ) )
	}

	render() {

		const { bundles } = this.props;

		let bundles_html = bundles.map( ( bundle, index ) => {
			return (
				<div class="col" key={ index }>
					<h3>
						<a class="btn btn-primary" href={ "/bundle/" + bundle.name.toLowerCase() } role="button">
							{ bundle.name }
						</a>
					</h3>
				</div>
			)
		});

		return (

			<main role="main">

				<Jumbotron title="Bundles"></Jumbotron>

				<div class="container">
					<div class="row">
						{ bundles_html }
					</div>

				</div>

			</main>
		)
	}
}