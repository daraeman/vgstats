const Boost = require( "../model/Boost" );
const Stat = require( "../model/Stat" );
const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject) => {
		
		Boost.findOne( { title: data.title } )
			.then( ( boost ) => {
				if ( ! boost ) {
					let boost = new Boost({
						title: data.title,
						giftable: data.giftable,
					});
					if ( typeof data.boost_amount !== "undefined" )
						boost.amount = data.boost_amount;
					return boost.save();
				}
				else {
					return boost;
				}
			})
			.then( ( boost ) => {
				if ( ! boost )
					throw new Error( "Boost not returned after creating" );
				return resolve( boost );
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const createStat = function( data, feed ) {
	return new Promise( ( resolve, reject) => {

		getOrCreate( data )
			.then( ( boost ) => {

				let remaining = data.SKUs.length;
				data.SKUs.forEach( ( sku ) => {

					let currency = Object.keys( sku.price )[0];
					let amount = sku.price[ Object.keys( sku.price )[0] ];

					Stat.findOne({
						id: sku.id,
						currency: currency,
						boost: boost._id,
						feed: feed._id,
					}).sort({ date: "desc" })
						.then( ( stat ) => {

							if ( ! stat || stat.amount !== amount ) {
								
								return Stat.create({
									id: sku.id,
									currency: currency,
									date: new Date(),
									amount: amount,
									boost: boost._id,
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