import React from "react"
import { connect } from "react-redux"
import * as d3 from "d3";

import { fetchSkin } from "../actions/Skin"

require( "../less/Skin.less" )

@connect( ( store ) => {
	return {
		skin: store.skin.skin.skin,
		stats: store.skin.skin.stats,
	}
})

export default class Skin extends React.Component {

	componentWillMount() {
		this.props.dispatch( fetchSkin( this.props.dispatch, this.props.match.params.skinName ) )
	}

	makeGraph( data, type ) {

		if ( ! data.length )
			return;

		let graph = d3.select( "#"+ type +"_graph" )
		let svg = graph.append( "svg" )

		let margin = { top: 20, right: 20, bottom: 30, left: 50 }
		let width = ( parseInt( svg.style( "width" ) ) - margin.left - margin.right )
		let height = ( parseInt( svg.style( "height" ) ) - margin.top - margin.bottom )
		let g = svg.append( "g" ).attr( "transform", "translate(" + margin.left + "," + margin.top + ")" )

		let x = d3.scaleTime()
			.rangeRound( [ 0, width ] )

		let y = d3.scaleLinear()
			.rangeRound( [ height, 0 ] )

		let line = d3.line()
			.x( function( d ) { return x( d.date ); })
			.y( function( d ) { return y( d.value ); })

		x.domain( [ d3.min( data, function( d ) { return d.date; }), new Date() ])
		y.domain( d3.extent( data, function( d ) { return d.value; }))

		g.append( "g" )
				.attr( "transform", "translate( 0," + height + " )" )
				.call( d3.axisBottom( x ) )
			.select( ".domain" )
				.remove()

		g.append( "g" )
				.call( d3.axisLeft( y ) )
			.append( "text" )
				.attr( "fill", "#000" )
				.attr( "transform", "rotate( -90 )" )
				.attr( "y", 6 )
				.attr( "dy", "0.71em" )
				.attr( "text-anchor", "end" )
				.text( type[0].toUpperCase() + type.slice( 1 ) )

		data.forEach( ( d, index ) => {

			let this_data = [ d ]
			let color = "blue"

			// if this is the last value, extend to the current date
			if ( index === ( data.length - 1 ) ) {
				this_data.push({
					date: new Date(),
					value: d.value
				})
				color = "red"
				console.log( this_data )
			}
			// otherwise, extend line until the start of the next line
			else {
				this_data.push({
					date: data[ index + 1 ].date.setSeconds( data[ index + 1 ].date.getSeconds() - 1 ),
					value: d.value
				})
			}

			g.append( "path" )
				.datum( this_data )
				.attr( "fill", "none" )
				.attr( "stroke", color )
				.attr( "stroke-linejoin", "round" )
				.attr( "stroke-linecap", "round" )
				.attr( "stroke-width", 1.5 )
				.attr( "d", line )
		});
	}

	makeAllGraphs() {

		if ( ! this.props.stats.length )
			return;

		let data = this.props.stats.sort( ( a, b ) => {
			return ( a.date - b.date );
		}).map( ( item ) => {
			item.date = new Date( item.date );
			return item;
		});


		let ice = data.filter( ( d ) => {
			return ( d.currency === "gold" );
		});

		let opal = data.filter( ( d ) => {
			return ( d.currency === "opal" );
		});

		this.makeGraph( ice, "ice" );
		this.makeGraph( opal, "opal" );
	}

	// we need to wait until the html has been rendered, so we can send the element to d3
	componentDidMount() {
		this.makeAllGraphs()
	}

	// update the graphs once we get our data from the api
	componentDidUpdate() {
		this.makeAllGraphs()
	}

	render() {

		const { skin } = this.props

		return (

			<main role="main">

				<div class="jumbotron">
					<div class="container">
						<h1 class="">Skin: { skin.name }</h1>
					</div>
				</div>

				<div class="container" id="ice_graph"></div>
				<div class="container" id="opal_graph"></div>

			</main>
		)
	}
}