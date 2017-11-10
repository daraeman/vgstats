import React from "react"
import { connect } from "react-redux"
import LineGraph from "./LineGraph"
import Jumbotron from "./Jumbotron"

import { fetchSkin } from "../actions/Skin"

require( "../less/Skin.less" )

@connect( ( store ) => {
	return {
		skin: store.skin.skin.skin,
		stats: store.skin.skin.stats,
	};
})

export default class Skin extends React.Component {

	componentWillMount() {
		
		this.props.dispatch( fetchSkin( this.props.dispatch, this.props.match.params.skinName ) );

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

		const { skin } = this.props

		console.log( "skin", skin )

		return (

			<main role="main">

				<Jumbotron title={ "Skin: "+ skin.name }></Jumbotron>

				<LineGraph data={ this.state.ice } id="graph_ice" name="ice"></LineGraph>
				<LineGraph data={ this.state.glory } id="graph_glory" name="glory"></LineGraph>

			</main>
		)
	}
}