import React from "react"

require( "../less/TopNav.less" )

export default class TopNav extends React.Component {

	render() {

		let categories = [
			"Bundles",
			"Skins",
			"Heroes",
			"In-App Purchases",
			"Boosts",
			"Actions",
		];

		let categories_html = categories.map( ( category, index ) => {
			return (
				<a class="dropdown-item" href={ "/" + category.toLowerCase() } key={ index }>{ category }</a>
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
					<form class="form-inline my-2 my-lg-0">
						<input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search"></input>
						<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
					</form>
				</div>
			</nav>
		)
	}
}