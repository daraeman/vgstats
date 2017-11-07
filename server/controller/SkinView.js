const Skin = require( "../model/Skin" );
const Stat = require( "../model/Stat" );

module.exports.skins_list = function( request, response ) {
	
	Skin.find( { })
		.then( ( skins ) => {
			if ( ! skins || ! skins.length )
				throw new Error( "No Skins Found" );
			skins = skins.map( ( skin ) => {
				return { name: skin.symbol };
			});
			return response.json( skins );
		})
		.catch( ( error ) => {
			response.status( 500 ).send( error );
		});
};

module.exports.skin_data = function( request, response ) {

	let data = {};
	
	Skin.findOne( { symbol: new RegExp( "^" + request.body.name + "$", "i" ) } )
		.then( ( skin ) => {
			if ( ! skin )
				throw new Error( "Skin not found" );
			data.skin = {
				name: skin.symbol,
			};
			return Stat.find({ skin: skin._id });
		})
		.then( ( stats ) => {
			if ( stats && stats.length ) {
				data.stats = stats.map( ( stat ) => { return {
					currency: stat.currency,
					date: stat.date,
					value: stat.amount,
				}; });
			}
			return response.json( data );
		})
		.catch( ( error ) => {
			response.status( 500 ).json( { error: error.toString() } );
		});
};