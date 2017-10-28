const Skin = require( "../model/Skin" );
const Stat = require( "../model/Stat" );

const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject) => {
		
		Skin.findOne( { symbol: data.symbol } )
			.then( ( hero ) => {
				if ( ! hero ) {
					return Skin.create({
						symbol: data.symbol,
					});
				}
				else {
					return hero;
				}
			})
			.then( ( hero ) => {
				if ( ! hero )
					throw new Error( "Skin not returned after creating" );
				return resolve( hero );
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const createStat = function( data, feed ) {
	return new Promise( ( resolve, reject) => {

		getOrCreate( data )
			.then( ( skin ) => {

				let remaining = data.SKUs.length;
				data.SKUs.forEach( ( sku ) => {

					let currency = Object.keys( sku.price )[0];
					let amount = sku.price[ Object.keys( sku.price )[0] ];

					Stat.findOne({
						id: sku.id,
						currency: currency,
						skin: skin._id,
						feed: feed._id,
					}).sort({ date: "desc" })
						.then( ( stat ) => {

							if ( ! stat || stat.amount !== amount ) {
								
								return Stat.create({
									id: sku.id,
									currency: currency,
									date: new Date(),
									amount: amount,
									skin: skin._id,
									feed: feed._id,
								});
							}
						})
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