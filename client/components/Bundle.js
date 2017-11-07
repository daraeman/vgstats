import React from "react"
import { connect } from "react-redux"
import LineGraph from "./LineGraph"

import { fetchBundle } from "../actions/Bundle"

require( "../less/Bundle.less" )

@connect( ( store ) => {
	return {
		bundle: store.bundle.bundle.bundle,
		stats: store.bundle.bundle.stats,
	}
})

export default class Bundle extends React.Component {

	componentWillMount() {

		this.props.dispatch( fetchBundle( this.props.dispatch, this.props.match.params.bundleName ) );

		this.setState({
			ice: [],
			glory: [],
		});

		this.formatData.bind( this );
	}

	formatData( stats ) {

		if ( ! stats.length )
			return;

		let data = stats.sort( ( a, b ) => {
			return ( a.date - b.date );
		}).map( ( item ) => {
			item.date = new Date( item.date );
			return item;
		});


		let ice = data.filter( ( d ) => {
			return ( d.currency === "gold" );
		});

		let glory = data.filter( ( d ) => {
			return ( d.currency === "silver" );
		});

		this.setState({
			ice: ice,
			glory: glory,
		});
		
	}

	componentWillReceiveProps( props ) {

		this.formatData( props.stats );
	}

	render() {

		const { bundle } = this.props;

		return (

			<main role="main">

				<div class="jumbotron">
					<div class="container">
						<h1 class="">Bundle: { bundle.name }</h1>
					</div>
				</div>

				<LineGraph data={ this.state.ice } id="graph_ice" name="ice"></LineGraph>
				<LineGraph data={ this.state.glory } id="graph_glory" name="glory"></LineGraph>

			</main>
		)
	}
}