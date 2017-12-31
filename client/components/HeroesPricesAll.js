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
			classDistributionData: [],
			classPriceData: {},
			classPriceGraphDataGoldAverage: [],
			classPriceGraphDataSilverAverage: [],
			classPriceGraphDataGoldTotal: [],
			classPriceGraphDataSilverTotal: [],
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
			results.all++;
			return results;
		}, { lane: 0, roam: 0, jungle: 0, all: 0 } );

		let classDistributionData = [
			{ item: "Laners", value: classTotals.lane },
			{ item: "Roamers", value: classTotals.roam },
			{ item: "Junglers", value: classTotals.jungle },
		];

		let classPriceData = heroes.reduce( ( results, hero ) => {
			results.gold_total += parseInt( hero.gold ) || 0;
			results.silver_total += parseInt( hero.silver ) || 0;
			results[ hero.class ].gold_total += parseInt( hero.gold ) || 0;
			results[ hero.class ].silver_total += parseInt( hero.silver ) || 0;
			return results;
		}, {
			gold_total: 0,
			silver_total: 0,
			jungle: {
				gold_total: 0,
				silver_total: 0,
			},
			lane: {
				gold_total: 0,
				silver_total: 0,
			},
			roam: {
				gold_total: 0,
				silver_total: 0,
			},
		});

		classPriceData.gold_average = Math.round( classPriceData.gold_total / classTotals.all ) || 0;
		classPriceData.silver_average = Math.round( classPriceData.silver_total / classTotals.all ) || 0;

		classPriceData.lane.gold_average = Math.round( classPriceData.lane.gold_total / classTotals.lane ) || 0;
		classPriceData.lane.silver_average = Math.round( classPriceData.lane.silver_total / classTotals.lane ) || 0;

		classPriceData.roam.gold_average = Math.round( classPriceData.roam.gold_total / classTotals.roam ) || 0;
		classPriceData.roam.silver_average = Math.round( classPriceData.roam.silver_total / classTotals.roam ) || 0;

		classPriceData.jungle.gold_average = Math.round( classPriceData.jungle.gold_total / classTotals.jungle ) || 0;
		classPriceData.jungle.silver_average = Math.round( classPriceData.jungle.silver_total / classTotals.jungle ) || 0;

		let classPriceGraphDataGoldAverage = [
			{ item: "All", value: classPriceData.gold_average },
			{ item: "Laners", value: classPriceData.lane.gold_average },
			{ item: "Roamers", value: classPriceData.roam.gold_average },
			{ item: "Junglers", value: classPriceData.jungle.gold_average },
		];
		let classPriceGraphDataSilverAverage = [
			{ item: "All", value: classPriceData.silver_average },
			{ item: "Laners", value: classPriceData.lane.silver_average },
			{ item: "Roamers", value: classPriceData.roam.silver_average },
			{ item: "Junglers", value: classPriceData.jungle.silver_average },
		];
		let classPriceGraphDataGoldTotal = [
			{ item: "Laners", value: classPriceData.lane.gold_average },
			{ item: "Roamers", value: classPriceData.roam.gold_average },
			{ item: "Junglers", value: classPriceData.jungle.gold_average },
		];
		let classPriceGraphDataSilverTotal = [
			{ item: "Laners", value: classPriceData.lane.silver_total },
			{ item: "Roamers", value: classPriceData.roam.silver_total },
			{ item: "Junglers", value: classPriceData.jungle.silver_total },
		];	

		this.setState({
			classTotals: classTotals,
			classDistributionData: classDistributionData,
			classPriceData: classPriceData,
			classPriceGraphDataGoldAverage: classPriceGraphDataGoldAverage,
			classPriceGraphDataSilverAverage: classPriceGraphDataSilverAverage,
			classPriceGraphDataGoldTotal: classPriceGraphDataGoldTotal,
			classPriceGraphDataSilverTotal: classPriceGraphDataSilverTotal,
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

				<BarGraph data={ this.state.classDistributionData } id="graph_class_distribution" name="graph_class_distribution" />

				<div class="header">Hero Class Ice Average</div>

				<BarGraph data={ this.state.classPriceGraphDataGoldAverage } id="graph_class_gold_average" name="graph_class_gold_average" />

				<div class="header">Hero Class Glory Average</div>

				<BarGraph data={ this.state.classPriceGraphDataSilverAverage } id="graph_class_silver_average" name="graph_class_silver_average" />

				<div class="header">Hero Class Ice Total</div>

				<BarGraph data={ this.state.classPriceGraphDataGoldTotal } id="graph_class_gold_total" name="graph_class_gold_total" />

				<div class="header">Hero Class Glory Total</div>

				<BarGraph data={ this.state.classPriceGraphDataSilverTotal } id="graph_class_silver_total" name="graph_class_silver_total" />

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