import React from "react"
import { connect } from "react-redux"
import BarGraph from "./BarGraph"

import { fetchHeroes } from "../actions/Heroes"

require( "../less/HeroesPricesAll.less" )

@connect( ( store ) => {
	return {
		heroes: store.heroes.heroes,
	}
})

export default class HeroesPricesAll extends React.Component {

	componentWillMount() {
		this.props.dispatch( fetchHeroes( this.props.dispatch ) )
		this.setState({
			sort: {
				type: "name",
				order: "asc",
			},
			defaultSortOrder: "asc",
			classTotals: {
				lane: 0,
				roam: 0,
				jungle: 0,
			},
			barGraphData: [],
		});
	}

	sorter( a, b, key ) {
		if ( this.state.sort.order === "asc" ) {
			if ( ! a[ key ] )
				return -1;
			if ( ! b[ key ] )
				return 1;
			return ( a[ key ] < b[ key ] ) ? -1 : ( a[ key ] > b[ key ] ) ? 1 : 0;
		}
		else if ( this.state.sort.order === "desc" ) {
			if ( ! a[ key ] )
				return 1;
			if ( ! b[ key ] )
				return -1;
			return ( a[ key ] < b[ key ] ) ? 1 : ( a[ key ] > b[ key ] ) ? -1 : 0;
		}
	}

	sortData( data ) {

		if ( this.state.sort.type === "name" ) {
			data.sort( ( a, b ) => {
				return this.sorter( a, b, "name" );
			})
		}
		else if ( this.state.sort.type === "gold" ) {
			data.sort( ( a, b ) => {
				return this.sorter( a, b, "gold" );
			})
		}
		else if ( this.state.sort.type === "silver" ) {
			data.sort( ( a, b ) => {
				return this.sorter( a, b, "silver" );
			})
		}

		return data;
	}

	setSorting( type ) {

		if ( this.state.sort.type === type ) {
			let order = ( this.state.sort.order === "desc" ) ? "asc" : "desc";
			this.setState({
				sort: {
					type: type,
					order: order,
				},
			});
		}
		else {
			this.setState({
				sort: {
					type: type,
					order: this.state.defaultSortOrder,
				},
			});
		}
	}

	formatData( heroes ) {

		let classTotals = heroes.reduce( ( results, hero ) => {
			results[ hero.class ]++;
			return results;
		}, { lane: 0, roam: 0, jungle: 0 } );

		let barGraphData = [
			{ item: "laners", value: classTotals.lane },
			{ item: "roamers", value: classTotals.roam },
			{ item: "junglers", value: classTotals.jungle },
		];

		this.setState({
			classTotals: classTotals,
			barGraphData: barGraphData,
		});
	}

	componentWillReceiveProps( props ) {
		this.formatData( props.heroes );
	}

	render() {

		const { heroes } = this.props

		let hero_gold_total = 0;
		let hero_silver_total = 0;
		let heroes_html = this.sortData( heroes ).map( ( hero, index ) => {
			hero_gold_total += parseInt( hero.gold ) || 0;
			hero_silver_total += parseInt( hero.silver ) || 0;
			return (
				<tr key={ index }>
					<td>
						<a class="link" href={ "/hero/" + hero.name.toLowerCase() }>
							{ hero.name }
						</a>
					</td>
					<td class="ice">
						{ hero.gold }
					</td>
					<td class="glory">
						{ hero.silver }
					</td>
				</tr>
			)
		});

		let heroes_totals_html = (
			<tr>
				<td>
					Totals
				</td>
				<td class="ice">
					{ hero_gold_total }
				</td>
				<td class="glory">
					{ hero_silver_total }
				</td>
			</tr>
		);

		return (

			<main id="main">

				<div class="header">Hero Class Distribution</div>

				<BarGraph data={ this.state.barGraphData } id="graph_classes" name="classes" />

				<div class="header">Hero Prices</div>

				<table>
					<thead>
						<tr>
							<th onClick={ () => { this.setSorting( "name" ) } }>Name</th>
							<th onClick={ () => { this.setSorting( "gold" ) } }>Ice</th>
							<th onClick={ () => { this.setSorting( "silver" ) } }>Glory</th>
						</tr>
					</thead>
					<tbody>
						{ heroes_html }
					</tbody>
					<tfoot>
						{ heroes_totals_html }
					</tfoot>
				</table>
				
			</main>
		)
	}
}