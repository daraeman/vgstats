import React from "react"
import { connect } from "react-redux"

import { fetchActions } from "../actions/Actions"

require( "../less/Actions.less" )

@connect( ( store ) => {
	console.log( "store", store )
	return {
		actions: store.actions.actions,
	}
})

export default class Actions extends React.Component {

	componentWillMount() {
		this.props.dispatch( fetchActions( this.props.dispatch ) )
	}

	render() {

		const { actions } = this.props;

		let actions_html = actions.map( ( action, index ) => {
			return (
				<div class="col-md-2" key={ index }>
					<h3>
						<a class="btn btn-primary" href={ "/action/" + action.name.toLowerCase() } role="button">
							{ action.name }
						</a>
					</h3>
				</div>
			)
		});

		return (

			<main role="main">

				<div class="container">
					<h1 class="">Actions</h1>
				</div>

				<div class="container">
					<div class="row">
						{ actions_html }
					</div>

				</div>

			</main>
		)
	}
}