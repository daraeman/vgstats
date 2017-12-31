import React from "react";
import * as d3 from "d3";

require( "../less/BarGraph.less" );

export default class BarGraph extends React.Component {

	componentWillMount() {

		this.setState({
			id: this.props.id || "BarGraph_" + Math.random().toString( 36 ).substring( 6 ),
		});

		this.makeGraph.bind( this );
	}

	makeGraph( props, resize ) {

		console.log( "a", resize )

		if ( ! props || ! props.data.length )
			return;

		let data = props.data;
		let name = props.name;

		let graph = d3.select( "#"+ this.state.id );
		let svg = graph.select( "svg" );

		if ( ! svg.empty() && ! resize )
			return;

		if ( resize )
			svg.remove();

		svg = graph.append( "svg" );

		console.log( "b" )
		
		let margin = { top: 20, right: 20, bottom: 30, left: 40 },
			width = ( parseInt( svg.style( "width" ) ) - margin.left - margin.right ),
			height = ( parseInt( svg.style( "height" ) ) - margin.top - margin.bottom );

		let x = d3.scaleBand().rangeRound( [ 0, width ] ).padding( 0.1 ),
			y = d3.scaleLinear().rangeRound( [ height, 0 ] );

		let g = svg.append( "g" )
					.attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

		x.domain( data.map( function( d ) { return d.item; } ) );
		y.domain( [ 0, d3.max( data, function( d ) { return d.value; } ) ] );

		g.append( "g" )
				.attr( "class", "axis axis--x" )
				.attr( "transform", "translate( 0," + height + " )" )
				.call( d3.axisBottom( x ) );

		g.append( "g" )
				.attr( "class", "axis axis--y" )
				.call( d3.axisLeft( y ) )
			.append( "text" )
				.attr( "transform", "rotate( -90 )" )
				.attr( "y", 6 )
				.attr( "dy", "0.71em" )
				.attr( "text-anchor", "end" )
				.text( "Frequency" );

		g.selectAll( ".bar" )
			.data( data )
			.enter().append( "rect" )
				.attr( "class", "bar" )
				.attr( "x", function( d ) { return x( d.item ); } )
				.attr( "y", function( d ) { return y( d.value ); } )
				.attr( "width", x.bandwidth() )
				.attr( "height", function( d ) { return height - y( d.value ); } );

	}

	// we need to wait until the html has been rendered, so we can send the element to d3
	componentDidMount() {
		this.makeGraph( this.props );
		window.addEventListener( "resize", () => {
			this.makeGraph( this.props, true )
		});
	}

	componentWillReceiveProps( props ) {
		this.makeGraph( props );
	}

	render() {

		const { data } = this.props;

		console.log( "data", data )

		return (
			<div class="container BarGraph" id={ this.state.id }></div>
		)
	}
}