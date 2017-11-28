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
			currencies: []
		});

		this.formatData.bind( this );
	}

	formatData( stats ) {

		if ( ! stats.length )
			return;

		let currencies = [];
		let data = stats.sort( ( a, b ) => {
			return ( a.date - b.date );
		}).map( ( item ) => {
			item.date = new Date( item.date );
			if ( currencies.indexOf( item.currency === -1 ) )
				currencies.push( item.currency );
			return item;
		});

		currencies = currencies.map( ( currency ) => {
			console.log( "currency", currency )
			let currency_data = data.filter( ( d ) => {
				return ( currency === d.currency );
			});
			let this_data = {
				name: currency,
				data: currency_data,
			};
			return this_data;
		});

		console.log( "currencies", currencies )

		this.setState( { currencies: currencies } );
		
	}

	componentWillReceiveProps( props ) {

		this.formatData( props.stats );
	}

	render() {

		const { skin } = this.props

		console.log( " this.state.currencies",  this.state.currencies )

		let lineGraphs = this.state.currencies.map( ( currency ) => {
			console.log( currency )
			return ( <LineGraph data={ currency.data } id={ "graph_" + currency.name } name={ currency.name } key={ currency.name }></LineGraph> )
		})

		console.log( "lineGraphs", lineGraphs )

		console.log( "skin", skin )

		return (

			<main role="main">

				<Jumbotron title={ "Skin: "+ skin.name }></Jumbotron>

				<div>
					{ lineGraphs }
				</div>

			</main>
		)
	}
}