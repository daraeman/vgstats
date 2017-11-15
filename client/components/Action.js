import React from "react"
import { connect } from "react-redux"
import LineGraph from "./LineGraph"
import Jumbotron from "./Jumbotron"

import { fetchAction } from "../actions/Action"

require( "../less/Action.less" )

@connect( ( store ) => {
	return {
		action: store.action.action.action,
		stats: store.action.action.stats,
	}
})

export default class Action extends React.Component {

	componentWillMount() {

		this.props.dispatch( fetchAction( this.props.dispatch, this.props.match.params.actionName ) );

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

		const { action } = this.props;

		return (

			<main role="main">

				<Jumbotron title={ "Action: "+ action.name }></Jumbotron>

				<LineGraph data={ this.state.ice } id="graph_ice" name="ice"></LineGraph>
				<LineGraph data={ this.state.glory } id="graph_glory" name="glory"></LineGraph>

			</main>
		)
	}
}