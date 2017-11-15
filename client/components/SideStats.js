import React from "react";

require( "../less/SideStats.less" );

export default class SideStats extends React.Component {

	render() {

		const { title, data } = this.props;

		let data_html = data.map( ( item, index ) => {

			let item_html;
			if ( item.text ) {
				item_html = ( <div class="text">{ item.text }</div> );
			}
			else if ( item.list && item.list.type === "link" ) {
				item_html = item.list.items.map( ( list_item, index ) => {
					return ( <a class="btn btn-primary" href={ list_item.link } key={ index }>{ list_item.text }</a> );
				});
				item_html = (
					<div class="btn-group-vertical">
						{ item_html }
					</div>
				);
			}

			return (
				<div class="item" key={ index }>
					<div class="title">{ item.title }</div>
					{ item_html }
				</div>
			)
		});

		return (

			<div class="col side_stats">

				<h2>{ title }</h2>
				
				{ data_html }

			</div>
		)
	}
}