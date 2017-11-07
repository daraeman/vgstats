import React from "react"

require( "../less/Splash.less" )

export default class Splash extends React.Component {

	render() {

		let categories = [
			{ name: "Bundles", path: "bundles" },
			{ name: "Skins", path: "skins" },
			{ name: "Heroes", path: "heroes" },
			{ name: "In-App Purchases", path: "iaps" },
			{ name: "Boosts", path: "boosts" },
			{ name: "Actions", path: "actions" },
		];

		let categories_html = categories.map( ( category, index ) => {
			return (
				<div class="col-md-4" key={ index }>
					<p><a class="btn btn-primary" href={ "/" + category.path } role="button">{ category.name }</a></p>
				</div>
			)
		});

		return (

			<main role="main">

				<div class="jumbotron">
					<div class="container">
						<h1 class="display-3">Welcome to VGSTATS</h1>
						<p>Letting you know whether the skin deal is actually good since 2017.</p>
						<p>Click one of the categories below, or search for something in the top bar to get started.</p>
					</div>
				</div>

				<div class="container splash_buttons">
					<div class="row">
						{ categories_html }
					</div>

				</div>

			</main>
		)
	}
}