const Bundle = require( "../model/Bundle" );
const Stat = require( "../model/Stat" );

const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject) => {
		
		Bundle.findOne( { symbol: data.symbol } )
			.then( ( bundle ) => {
				if ( ! bundle ) {
					return Bundle.create({
						symbol: data.symbol,
					});
				}
				else {
					return bundle;
				}
			})
			.then( ( bundle ) => {
				if ( ! bundle )
					throw new Error( "Bundle not returned after creating" );
				return resolve( bundle );
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const createStat = function( data, feed ) {
	return new Promise( ( resolve, reject) => {

		getOrCreate( data )
			.then( ( bundle ) => {

				let remaining = data.SKUs.length;
				data.SKUs.forEach( ( sku ) => {

					let stat = new Stat({
						id: sku.id,
						currency: Object.keys( sku.price )[0],
						date: new Date(),
						amount: sku.price[ Object.keys( sku.price )[0] ],
						bundle: bundle._id,
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