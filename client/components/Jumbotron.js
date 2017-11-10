import React from "react"

require( "../less/Jumbotron.less" )

export default class Jumbotron extends React.Component {

	render() {

		const { title } = this.props

		return (
			<div class="jumbotron">
				<div class="container">
					<h1 class="">{ title }</h1>
				</div>
			</div>
		)
	}
}