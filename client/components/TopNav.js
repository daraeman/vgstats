import React from "react"

require( "../less/TopNav.less" )

export default class TopNav extends React.Component {

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
				<a class="dropdown-item" href={ "/" + category.path } key={ index }>{ category.name }</a>
			)
		});

		return (

			 <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
				<a class="navbar-brand" href="/">VGSTATS</a>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>

				<div class="collapse navbar-collapse" id="navbarsExampleDefault">
					<ul class="navbar-nav mr-auto">
						<li class="nav-item dropdown">
							<a class="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Categories</a>
							<div class="dropdown-menu" aria-labelledby="dropdown01">
								{ categories_html }
							</div>
						</li>
					</ul>
				</div>
			</nav>
		)
	}
}