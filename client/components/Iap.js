import React from "react"
import { connect } from "react-redux"
import LineGraph from "./LineGraph"
import Jumbotron from "./Jumbotron"

import { fetchIap } from "../actions/Iap"

require( "../less/Iap.less" )

@connect( ( store ) => {
	return {
		iap: store.iap.iap.iap,
		stats: store.iap.iap.stats,
	}
})

export default class Iap extends React.Component {

	componentWillMount() {

		this.props.dispatch( fetchIap( this.props.dispatch, this.props.match.params.iapName ) );

		this.setState({
			usd: [],
			cny: [],
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


		let USD = data.filter( ( d ) => {
			return ( typeof d.USD !== "undefined" );
		}).map( ( d ) => {
			d.value = d.amount;
			d.currency = "USD";
			return d;
		});

		let CNY = data.filter( ( d ) => {
			return ( typeof d.CNY !== "undefined" );
		}).map( ( d ) => {
			d.value = d.amount;
			d.currency = "CNY";
			return d;
		});

		this.setState({
			USD: USD,
			CNY: CNY,
		});
		
	}

	componentWillReceiveProps( props ) {

		this.formatData( props.stats );
	}

	render() {

		const { iap } = this.props;

		return (

			<main role="main">

				<Jumbotron title={ "In-App Purchase: "+ iap.name }></Jumbotron>
				
				<LineGraph data={ this.state.USD } id="graph_usd" name="usd"></LineGraph>
				<LineGraph data={ this.state.CNY } id="graph_cny" name="cny"></LineGraph>

			</main>
		)
	}
}