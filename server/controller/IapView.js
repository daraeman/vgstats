const Iap = require( "../model/Iap" );
const IapStat = require( "../model/IapStat" );

module.exports.iaps_list = function( request, response ) {

	Iap.find( {} )
		.then( ( iaps ) => {
			if ( ! iaps || ! iaps.length )
				throw new Error( "No Iaps Found" );
			iaps = iaps.map( ( iap ) => {
				return { name: iap.id };
			});
			return response.json( iaps );
		})
		.catch( ( error ) => {
			response.status( 500 ).send( error );
		});
};

module.exports.iap_data = function( request, response ) {

	let data = {};

	Iap.findOne( { id: new RegExp( "^" + request.body.name + "$", "i" ) } )
		.then( ( iap ) => {

			if ( ! iap )
				throw new Error( "Iap not found" );

			data.iap = {
				name: iap.id,
			};

			return IapStat.find({ iap: iap._id });
		})
		.then( ( stats ) => {

			if ( stats && stats.length ) {

				data.stats = stats.map( ( stat ) => {

					return {
						date: stat.date,
						amount: stat.amount,
						enabled: stat.enabled,
						USD: stat.USD,
						CNY: stat.CNY,
						missing: stat.missing,
					};

				});
			}
			return response.json( data );
		})
		.catch( ( error ) => {
			response.status( 500 ).json( { error: error.toString() } );
		});
};