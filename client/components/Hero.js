import React from "react"
import { connect } from "react-redux"
import LineGraph from "./LineGraph"
import Jumbotron from "./Jumbotron"
import SideStats from "./SideStats"

import { fetchHero } from "../actions/Hero"

require( "../less/Hero.less" )

@connect( ( store ) => {
	return {
		hero: store.hero.hero.hero,
		stats: store.hero.hero.stats,
		skins: store.hero.hero.skins,
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

	formatDate( date ) {
		const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		return months[ date.getMonth() ] + " "+ date.getDay() + ", "+ date.getFullYear();
	}

	render() {

		const { hero, skins } = this.props;

		let side_stats_data = [];

		if ( hero.release_date ) {
			let release_date = new Date( hero.release_date * 1000 );
			side_stats_data.push( { title: "Released", text: this.formatDate( release_date ) } );
		}

		side_stats_data.push(
			{ title: "Skins", list: {
				type: "link",
				items: skins.map( ( skin ) => {
					return {
						link: "/skin/"+ skin.name,
						text: skin.name,
					};
				}),
			}},
		);

		return (

			<main role="main">

				<Jumbotron title={ "Hero: "+ hero.name }></Jumbotron>

				<div class="container">

					<div class="row">

						<div class="col">

							<h2>Ice</h2>
							<LineGraph data={ this.state.ice } id="graph_ice" name="ice"></LineGraph>

							<h2>Glory</h2>
							<LineGraph data={ this.state.glory } id="graph_glory" name="glory"></LineGraph>

						</div>

						<SideStats title="Stats" data={ side_stats_data }></SideStats>

					</div>

				</div>

			</main>
		)
	}
}