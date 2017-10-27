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

					let stat = new Stat({
						id: sku.id,
						currency: Object.keys( sku.price )[0],
						date: new Date(),
						amount: sku.price[ Object.keys( sku.price )[0] ],
						boost_id: boost._id,
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