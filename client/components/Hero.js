import React from "react"
import { connect } from "react-redux"
import LineGraph from "./LineGraph"
import Jumbotron from "./Jumbotron"

import { fetchHero } from "../actions/Hero"

require( "../less/Hero.less" )

@connect( ( store ) => {
	return {
		hero: store.hero.hero.hero,
		stats: store.hero.hero.stats,
	}
})

export default class Hero extends React.Component {

	componentWillMount() {

		this.props.dispatch( fetchHero( this.props.dispatch, this.props.match.params.heroName ) );

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

		const { hero } = this.props;

		return (

			<main role="main">

				<Jumbotron title={ "Hero: "+ hero.name }></Jumbotron>

				<LineGraph data={ this.state.ice } id="graph_ice" name="ice"></LineGraph>
				<LineGraph data={ this.state.glory } id="graph_glory" name="glory"></LineGraph>

			</main>
		)
	}
}