import React from "react"

require( "../less/Footer.less" )

export default class Footer extends React.Component {

	render() {

		return (
			<footer class="container">
				<p>&copy; VGSTATS 2017</p>
			</footer>
		)
	}
}