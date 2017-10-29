import React from "react"

require( "../less/Splash.less" )

export default class Splash extends React.Component {

	render() {
		console.log( "HELP ME" )

		return (

			<main role="main">

				<div class="jumbotron">
					<div class="container">
						<h1 class="display-3">Welcome to VGSTATS</h1>
						<p>This site exists to provide historical data on Hero, Skin, etc pricing in the excellent Vainglory game.</p>
						<p>Click one of the categories below, or search for something in the top bar to get started.</p>
					</div>
				</div>

				<div class="container splash_buttons">
					<div class="row">
						<div class="col-md-4">
							<p><a class="btn btn-primary" href="#" role="button">Bundles</a></p>
						</div>
						<div class="col-md-4">
							<p><a class="btn btn-primary" href="#" role="button">Skins</a></p>
						</div>
						<div class="col-md-4">
							<p><a class="btn btn-primary" href="#" role="button">Heros</a></p>
						</div>
						<div class="col-md-4">
							<p><a class="btn btn-primary" href="#" role="button">In-App Purchases</a></p>
						</div>
						<div class="col-md-4">
							<p><a class="btn btn-primary" href="#" role="button">Boosts</a></p>
						</div>
						<div class="col-md-4">
							<p><a class="btn btn-primary" href="#" role="button">Actions</a></p>
						</div>
					</div>

				</div>

			</main>
		)
	}
}