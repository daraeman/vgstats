const Boost = require( "../model/Boost" );
const Stat = require( "../model/Stat" );

const get = function( data ) {
	return Boost.findOne( { title: data.title } );
};

const create = function( data ) {
	let boost = new Boost({
		title: data.title,
		giftable: data.giftable,
	});
	if ( typeof data.boost_amount !== "undefined" )
		boost.amount = data.boost_amount;
	return boost.save();
};

const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject) => {
		
		get( data )
			.then( ( boost ) => {
				if ( ! boost )
					return create( data );
				else
					return boost;
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

const createStat = function( data, feed, date ) {
	
	return new Promise( ( resolve, reject ) => {

		let stats = [];
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
									boost: boost._id,
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
								return resolve( { category: "boost", stats: stats } );
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
				boost: stat.boost,
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