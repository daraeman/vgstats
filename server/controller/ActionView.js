const Action = require( "../model/Action" );
const Stat = require( "../model/Stat" );

module.exports.actions_list = function( request, response ) {

	Action.find( {} )
		.then( ( actions ) => {

			if ( ! actions || ! actions.length )
				throw new Error( "No Actions Found" );

			actions = actions.map( ( action ) => {
				return { name: action.action };
			});

			return response.json( actions );
			
		})
		.catch( ( error ) => {
			response.status( 500 ).send( error );
		});
};

module.exports.action_data = function( request, response ) {
	
	let data = {};

	Action.findOne( { action: new RegExp( "^" + request.body.name + "$", "i" ) } )
		.then( ( action ) => {

			if ( ! action )
				throw new Error( "Action not found" );

			data.action = {
				name: action.action,
			};

			return Stat.find({ action: action._id });

		})
		.then( ( stats ) => {
			if ( stats && stats.length ) {
				data.stats = stats.map( ( stat ) => { return {
					currency: stat.currency,
					date: stat.date,
					value: stat.amount,
					missing: stat.missing,
				}; });
			}
			return response.json( data );
		})
		.catch( ( error ) => {
			response.status( 500 ).json( { error: error.toString() } );
		});
};