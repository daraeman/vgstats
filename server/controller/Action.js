const Action = require( "../model/Action" );
const Stat = require( "../model/Stat" );

const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject) => {

		Action.findOne( { action: data.action } )
			.then( ( action ) => {
				if ( ! action ) {
					return Action.create({
						action: data.action,
					});
				}
				else {
					return action;
				}
			})
			.then( ( action ) => {
				if ( ! action )
					throw new Error( "Action not returned after creating" );
				return resolve( action );
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const createStat = function( data, feed ) {
	return new Promise( ( resolve, reject) => {

		getOrCreate( data )
			.then( ( action ) => {

				let remaining = data.SKUs.length;
				data.SKUs.forEach( ( sku ) => {

					let currency = Object.keys( sku.price )[0];
					let amount = sku.price[ Object.keys( sku.price )[0] ];

					Stat.findOne({
						id: sku.id,
						currency: currency,
						action: action._id,
						feed: feed._id,
					}).sort({ date: "desc" })
						.then( ( stat ) => {

							if ( ! stat || stat.amount !== amount ) {
								
								return Stat.create({
									id: sku.id,
									currency: currency,
									date: new Date(),
									amount: amount,
									action: action._id,
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