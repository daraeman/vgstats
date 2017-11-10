import React from "react"
import { connect } from "react-redux"
import Jumbotron from "./Jumbotron"

import { fetchSkins } from "../actions/Skins"

require( "../less/Skins.less" )

@connect( ( store ) => {
	console.log( "store", store )
	return {
		skins: store.skins.skins,
	}
})

export default class Skins extends React.Component {

	componentWillMount() {
		this.props.dispatch( fetchSkins( this.props.dispatch ) )
	}

	render() {

		const { skins } = this.props

		let skins_html = skins.map( ( skin, index ) => {
			return (
				<div class="col-md-2" key={ index }>
					<h3>
						<a class="btn btn-primary" href={ "/skin/" + skin.name.toLowerCase() } role="button">
							{ skin.name }
						</a>
					</h3>
				</div>
			)
		});

		return (

			<main role="main">

				<Jumbotron title="Skins"></Jumbotron>

				<div class="container">
					<div class="row">
						{ skins_html }
					</div>

				</div>

			</main>
		)
	}
}