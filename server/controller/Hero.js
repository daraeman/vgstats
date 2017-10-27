const Hero = require( "../model/Hero" );
const Stat = require( "../model/Stat" );
const ImageController = require( "./Image" );
const VideoController = require( "./Video" );

const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject) => {
		
		Hero.findOne( { title: data.title } )
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
					.then( ( image ) => {

						if ( ! image )
							throw new Error( "Failed to getOrCreate Image [%s]", data.image );

						hero.image = image._id;

						if ( ! data.video )
							return null;

						return VideoController.getOrCreate( data.video );
					})
					.then( ( video ) => {

						if ( video && video._id )
							hero.video = video._id;

						return hero.save();
					})
					.then( ( hero ) => {
						return resolve( hero );
					});
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const createStat = function( data, feed ) {
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
						feed_id: feed._id,
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