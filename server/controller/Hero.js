const Hero = require( "../model/Hero" );
const Stat = require( "../model/Stat" );
const ImageController = require( "./Image" );
const VideoController = require( "./Video" );

const get = function( data ) {
	return Hero.findOne( { title: data.title } );
};

const create = function( data ) {
	return Hero.create({
		title: data.title,
		symbol: data.symbol,
		lore: data.lore,
		video: data.video,
		vgf: data.vgf,
		epoch: data.newEpoch,
	});
};

const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject) => {
		
		get( data )
			.then( ( hero ) => {
				if ( ! hero )
					return create( data );
				else
					return hero;
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

const createStat = function( data, feed, date ) {
	
	return new Promise( ( resolve, reject ) => {

		let stats = [];
		getOrCreate( data )
			.then( ( hero ) => {

				let remaining = data.SKUs.length;
				data.SKUs.forEach( ( sku ) => {

					let currency = Object.keys( sku.price )[0];
					let amount = sku.price[ Object.keys( sku.price )[0] ];

					Stat.findOne({
						id: sku.id,
						currency: currency,
						hero: hero._id,
						feed: feed._id,
					}).sort({ date: "desc" })
						.then( ( stat ) => {
							
							if ( ! stat || stat.amount !== amount ) {

								let stat = new Stat({
									id: sku.id,
									currency: currency,
									date: date,
									amount: amount,
									hero: hero._id,
									feed: feed._id,
								});

								if ( typeof data.onSale !== "undefined" )
									stat.on_sale = data.onSale;

								return stat.save();
							}
							else {
								return stat;
							}
						})
						.then( ( stat ) => {
							stats.push( stat );
							if ( --remaining === 0 )
								return resolve( { category: "hero", stats: stats } );
						});
				});
			})
			.catch( ( error ) => {
				return reject( error );
			});
		
	});
};

const checkAndAddMissingStat = function( stat ) {

	return new Promise( ( resolve, reject ) => {

		if ( stat && ! stat.missing ) {
			
			Stat.create({
				id: stat.id,
				currency: stat.currency,
				date: new Date(),
				hero: stat.hero,
				feed: stat.feed,
				missing: true,
			})
			.then( () => {
				return resolve();
			})
			.catch( ( error ) => {
				return reject( error );
			});
		}
		else {
			resolve();
		}

	});
};

module.exports = {
	getOrCreate: getOrCreate,
	createStat: createStat,
	checkAndAddMissingStat: checkAndAddMissingStat,
};