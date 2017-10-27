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

					let stat = new Stat({
						id: sku.id,
						currency: Object.keys( sku.price )[0],
						date: new Date(),
						amount: sku.price[ Object.keys( sku.price )[0] ],
						skin_id: skin._id,
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