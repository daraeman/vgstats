import React from "react"
import * as d3 from "d3";

require( "../less/LineGraph.less" )

export default class LineGraph extends React.Component {

	componentWillMount() {

		this.setState({
			id: this.props.id || "LineGraph_" + Math.random().toString( 36 ).substring( 6 ),
		})

		this.makeGraph.bind( this );
	}

	makeGraph( props ) {

		if ( ! props || ! props.data.length )
			return;

		let data = props.data;
		let name = props.name;

		let graph = d3.select( "#"+ this.state.id );
		let svg = graph.append( "svg" );

		let margin = { top: 20, right: 20, bottom: 30, left: 50 };
		let width = ( parseInt( svg.style( "width" ) ) - margin.left - margin.right );
		let height = ( parseInt( svg.style( "height" ) ) - margin.top - margin.bottom );
		let g = svg.append( "g" ).attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

		let x = d3.scaleTime()
			.rangeRound( [ 0, width ] );

		let y = d3.scaleLinear()
			.rangeRound( [ height, 0 ] );

		let line = d3.line()
			.defined( function( d ) { return ( d.value !== false ); })
			.x( function( d ) { return x( d.date ); })
			.y( function( d ) { return y( d.value ); });

		x.domain( [ d3.min( data, function( d ) { return d.date; }), new Date() ]);
		y.domain( d3.extent( data, function( d ) { return d.value; }));

		g.append( "g" )
				.attr( "transform", "translate( 0," + height + " )" )
				.call( d3.axisBottom( x ) )
			.select( ".domain" )
				.remove();

		g.append( "g" )
				.call( d3.axisLeft( y ) )
			.append( "text" )
				.attr( "fill", "#000" )
				.attr( "transform", "rotate( -90 )" )
				.attr( "y", 6 )
				.attr( "dy", "0.71em" )
				.attr( "text-anchor", "end" )
				.text( name[0].toUpperCase() + name.slice( 1 ) );

		data.forEach( ( d, index ) => {

			if ( d.missing )
				d.value = false;

			let this_data = [ d ];
			let color = "blue";

			// if this is the last value, extend to the current date
			if ( index === ( data.length - 1 ) ) {
				console.log( d );
				this_data.push({
					date: new Date(),
					value: ( d.missing ) ? false : d.value,
				});
				color = "red";
				console.log( this_data );
			}
			// otherwise, extend line until the start of the next line
			else {
				this_data.push({
					date: data[ index + 1 ].date.setSeconds( data[ index + 1 ].date.getSeconds() - 1 ),
					value: ( d.missing ) ? false : d.value,
				});
			}

			g.append( "path" )
				.datum( this_data )
				.attr( "fill", "none" )
				.attr( "stroke", color )
				.attr( "stroke-linejoin", "round" )
				.attr( "stroke-linecap", "round" )
				.attr( "stroke-width", 1.5 )
				.attr( "d", line );
		});
	}

	// we need to wait until the html has been rendered, so we can send the element to d3
	componentDidMount() {
		this.makeGraph();
	}

	componentWillReceiveProps( props ) {
		this.makeGraph( props );
	}

	render() {

		const { data } = this.props

		return (
			<div class="container" id={ this.state.id }></div>
		)
	}
}