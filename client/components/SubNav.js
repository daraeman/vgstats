import React from "react"

require( "../less/SubNav.less" )

export default class SubNav extends React.Component {

	render() {

		let links = [
			//{ name: "Bundles", path: "bundles" },
			//{ name: "Skins", path: "skins" },
			{ name: "prices_all", path: "heroes/prices_all" },
			//{ name: "In-App Purchases", path: "iaps" },
			//{ name: "Boosts", path: "boosts" },
			//{ name: "Actions", path: "actions" },
		];

		let links_html = links.map( ( link, index ) => {
			return (
				<a class="link" href={ "/" + link.path } key={ index }>{ link.name }</a>
			)
		});

		return (

			<nav id="sub_menu">

				<div class="menu_items">
					{ links_html }
				</div>

			</nav>
		)
	}
}