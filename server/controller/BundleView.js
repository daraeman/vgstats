const Bundle = require( "../model/Bundle" );
const Stat = require( "../model/Stat" );

module.exports.bundles_list = function( request, response ) {

	Bundle.find( {} )
		.then( ( bundles ) => {

			if ( ! bundles || ! bundles.length )
				throw new Error( "No Bundles Found" );

			bundles = bundles.map( ( bundle ) => {
				return { name: bundle.symbol };
			});

			return response.json( bundles );
			
		})
		.catch( ( error ) => {
			response.status( 500 ).send( error );
		});
};

module.exports.bundle_data = function( request, response ) {
	
	let data = {};

	Bundle.findOne( { symbol: new RegExp( "^" + request.body.name + "$", "i" ) } )
		.then( ( bundle ) => {

			if ( ! bundle )
				throw new Error( "Bundle not found" );

			data.bundle = {
				name: bundle.symbol,
			};

			return Stat.find({ bundle: bundle._id });

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