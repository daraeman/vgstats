const Hero = require( "../model/Hero" );
const Skin = require( "../model/Skin" );
const Stat = require( "../model/Stat" );

module.exports.heroes_list = function( request, response ) {
	
	Hero.find( {} )
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
		});
};

module.exports.hero_data = function( request, response ) {

	let data = {};
	let this_hero;

	Hero.findOne( { title: new RegExp( "^" + request.body.name + "$", "i" ) } )
		.then( ( hero ) => {
			if ( ! hero )
				throw new Error( "Hero not found" );
			this_hero = hero;
			data.hero = {
				name: hero.title,
				release_date: hero.epoch,
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
			else {
				data.stats = [];
			}
			return Skin.find({ hero: this_hero._id });
		})
		.then( ( skins ) => {
			if ( skins && skins.length ) {
				data.skins = skins.map( ( skin ) => { return {
					name: skin.symbol,
				}; });
			}
			else {
				data.skins = [];
			}
			return response.json( data );
		})
		.catch( ( error ) => {
			response.status( 500 ).json( { error: error.toString() } );
		});
};
