const Skin = require( "../model/Skin" );

module.exports.skins_list = function( request, response ) {
	Skin.find({})
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
		})
	
};