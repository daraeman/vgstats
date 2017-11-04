const Action = require( "../model/Action" );
const Stat = require( "../model/Stat" );

const get = function( data ) {
	return Action.findOne( { action: data.action } );
};

const create = function( data ) {
	return Action.create({ action: data.action });
};

const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject ) => {

		get( data )
			.then( ( action ) => {
				if ( ! action ) {
					return create( data );
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

const createStat = function( data, feed, date ) {
	
	return new Promise( ( resolve, reject ) => {

		let stats = [];
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
									date: date,
									amount: amount,
									action: action._id,
									feed: feed._id,
								});
							}
							else {
								return stat;
							}
						})
						.then( ( stat ) => {
							stats.push( stat );
							if ( --remaining === 0 )
								return resolve( { category: "action", stats: stats } );
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
				action: stat.action,
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