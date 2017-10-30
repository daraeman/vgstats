const Hero = require( "../model/Hero" );

module.exports.heroes_list = function( request, response ) {
	Hero.find({})
		.then( ( heroes ) => {
			if ( ! heroes || ! heroes.length )
				throw new Error( "No Heroes Found" );
			heroes = heroes.map( ( hero ) => {
				return { name: hero.title };
			});
			return response.json( heroes );
		})
		.catch( ( error ) => {
			response.status( 500 ).send( error );
		})
	
};