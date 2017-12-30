const Boost = require( "../model/Boost" );
const Stat = require( "../model/Stat" );

module.exports.boosts_list = function( request, response ) {

	Boost.find( {} )
		.then( ( boosts ) => {

			if ( ! boosts || ! boosts.length )
				throw new Error( "No Boosts Found" );

			boosts = boosts.map( ( boost ) => {
				return { name: boost.title };
			});

			return response.json( boosts );
			
		})
		.catch( ( error ) => {
			response.status( 500 ).send( error );
		});
};

module.exports.boost_data = function( request, response ) {
	
	let data = {};

	Boost.findOne( { title: new RegExp( "^" + request.body.name + "$", "i" ) } )
		.then( ( boost ) => {

			if ( ! boost )
				throw new Error( "Boost not found" );

			data.boost = {
				name: boost.title,
			};

			return Stat.find({ boost: boost._id });

		})
		.then( ( stats ) => {
			if ( stats && stats.length ) {
				data.stats = stats.map( ( stat ) => { return {
					currency: stat.currency,
					date: stat.date,
					value: stat.amount,
					missing: stat.missing,
					duration: stat.duration,
				}; });
			}
			return response.json( data );
		})
		.catch( ( error ) => {
			response.status( 500 ).json( { error: error.toString() } );
		});
};