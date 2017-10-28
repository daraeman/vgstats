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

					let currency = Object.keys( sku.price )[0];
					let amount = sku.price[ Object.keys( sku.price )[0] ];

					Stat.findOne({
						id: sku.id,
						currency: currency,
						bundle: bundle._id,
						feed: feed._id,
					}).sort({ date: "desc" })
						.then( ( stat ) => {

							if ( ! stat || stat.amount !== amount ) {
								
								return Stat.create({
									id: sku.id,
									currency: currency,
									date: new Date(),
									amount: amount,
									bundle: bundle._id,
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