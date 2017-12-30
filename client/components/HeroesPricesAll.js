import React from "react"
import { connect } from "react-redux"

import { fetchHeroes } from "../actions/Heroes"

require( "../less/HeroesPricesAll.less" )

@connect( ( store ) => {
	console.log( "store", store )
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
		});
	}

	sortData( data ) {

		if ( this.state.sort.type === "name" ) {
			data.sort( ( a, b ) => {
				if ( this.state.sort.order === "asc" )
					return ( a.name < b.name ) ? -1 : ( a.name > b.name ) ? 1 : 0;
				else if ( this.state.sort.order === "desc" )
					return ( a.name < b.name ) ? 1 : ( a.name > b.name ) ? -1 : 0;
			})
		}
		else if ( this.state.sort.type === "gold" ) {
			data.sort( ( a, b ) => {
				if ( this.state.sort.order === "asc" )
					return ( a.gold < b.gold ) ? -1 : ( a.gold > b.gold ) ? 1 : 0;
				else if ( this.state.sort.order === "desc" )
					return ( a.gold < b.gold ) ? 1 : ( a.gold > b.gold ) ? -1 : 0;
			})
		}
		else if ( this.state.sort.type === "silver" ) {
			data.sort( ( a, b ) => {
				if ( this.state.sort.order === "asc" )
					return ( a.silver < b.silver ) ? -1 : ( a.silver > b.silver ) ? 1 : 0;
				else if ( this.state.sort.order === "desc" )
					return ( a.silver < b.silver ) ? 1 : ( a.silver > b.silver ) ? -1 : 0;
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

	render() {

		const { heroes } = this.props

		let heroes_html = this.sortData( heroes ).map( ( hero, index ) => {
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

		return (

			<main id="main">

				<div class="header">Heroes Prices (all)</div>

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
				</table>
				
			</main>
		)
	}
}