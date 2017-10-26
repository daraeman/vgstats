const Hero = require( "../model/Hero" );
const Stat = require( "../model/Stat" );
const request = require( "request-promise-native" );

const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject) => {
		
		Hero.findOne( { title: data.symbol } )
			.then( ( hero ) => {
				if ( ! hero ) {
					return Hero.create({
						title: data.title,
						symbol: data.symbol,
					});
				}
				else {
					return hero;
				}
			})
			.then( ( hero ) => {

				if ( ! hero )
					throw new Error( "Hero not returned after creating" );

				ImageController.getOrCreate( "hero", data.image )
					.then( ( this_image ) => {

						if ( ! image )
							throw new Error( "Failed to getOrCreate Image [%s]", data.image );

						hero.image = image._id;

						if ( ! data.video )
							return null;

						return VideoController.getOrCreate( data.video )
					})
					.then( ( video ) => {

						hero.video = video._id;

						if ( ! video && data.video )
							throw new Error( "Failed to get Video [%s]", data.video );

						return hero.save();
					})
					.then( ( hero ) => {
						return resolve( hero );
					})
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const createStat = function( data ) {
	return new Promise( ( resolve, reject) => {

		getOrCreate( data )
			.then( ( hero ) => {

				let remaining = data.SKUs.length;
				data.SKUs.forEach( ( sku ) => {

					let stat = new Stat({
						id: sku.id,
						currency: Object.keys( sku.price )[0],
						date: new Date(),
						amount: sku.price[ Object.keys( sku.price )[0] ],
						hero: hero._id,
					});

					stat.save()
						.then( () => {
							if ( --remaining === 0 )
								return resolve();
						});

				});
			})
			.catch( ( error ) => {
				return reject( error );
			});
		
	});
};

module.exports = {
	getOrCreate: getOrCreate,
	createStat: createStat,
};