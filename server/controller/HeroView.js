const Hero = require( "../model/Hero" );
const Stat = require( "../model/Stat" );

const hero_data = function( request, response ) {
	let data = {};
	Hero.findOne( { title: new RegExp( "^" + request.body.name + "$", "i" ) } )
		.then( ( hero ) => {
			if ( ! hero )
				throw new Error( "Hero not found" );
			data.hero = {
				name: hero.title,
			};
			return Stat.find({ hero: hero._id });
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

module.exports = {
	hero_data: hero_data,
};