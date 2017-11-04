const Skin = require( "../model/Skin" );
const Stat = require( "../model/Stat" );

const get = function( data ) {
	return Skin.findOne( { symbol: data.symbol } );
};

const create = function( data ) {
	return Skin.create({ symbol: data.symbol });
};

const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject ) => {
		
		get( data )
			.then( ( skin ) => {
				if ( ! skin ) {
					return create( data );
				}
				else {
					return skin;
				}
			})
			.then( ( skin ) => {
				if ( ! skin )
					throw new Error( "Skin not returned after creating" );
				return resolve( skin );
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const createStat = function( data, feed, date ) {
	return new Promise( ( resolve, reject) => {

		let stats = [];
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

							if (
								! stat ||
								stat.missing || 
								(
									stat.amount !== amount &&
									! stat.missing
								)
							) {
								
								return Stat.create({
									id: sku.id,
									currency: currency,
									date: date,
									amount: amount,
									skin: skin._id,
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
								return resolve( { category: "skin", stats: stats } );
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
				skin: stat.skin,
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