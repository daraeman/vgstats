import React from "react"
import { connect } from "react-redux"
import LineGraph from "./LineGraph"
import Jumbotron from "./Jumbotron"

import { fetchBoost } from "../actions/Boost"

require( "../less/Boost.less" )

@connect( ( store ) => {
	return {
		boost: store.boost.boost.boost,
		stats: store.boost.boost.stats,
	}
})

export default class Boost extends React.Component {

	componentWillMount() {

		this.props.dispatch( fetchBoost( this.props.dispatch, this.props.match.params.boostName ) );

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

		const { boost } = this.props;

		return (

			<main role="main">

				<Jumbotron title={ "Boost: "+ boost.name }></Jumbotron>

				<LineGraph data={ this.state.ice } id="graph_ice" name="ice"></LineGraph>
				<LineGraph data={ this.state.glory } id="graph_glory" name="glory"></LineGraph>

			</main>
		)
	}
}