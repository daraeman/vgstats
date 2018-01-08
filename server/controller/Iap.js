const Iap = require( "../model/Iap" );
const IapStat = require( "../model/IapStat" );
const ImageController = require( "../controller/Image" );

const get = function( data ) {
	return Iap.findOne( { id: data.productID } );
};

const create = function( data ) {
	return Iap.create({
		type: data.type,
		id: data.productID,
	});
};

const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject ) => {

		get( data )
			.then( ( iap ) => {
				if ( ! iap )
					return create( data );
				else
					return iap;
			})
			.then( ( iap ) => {
				if ( ! iap )
					throw new Error( "Iap not returned after creating" );
				return resolve( iap );
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const createStat = function( data, feed, date ) {

	return new Promise( ( resolve, reject ) => {

		let this_image;
		let this_iap;
		getOrCreate( data )
			.then( ( iap ) => {
				this_iap = iap;
				if ( data.bgImg )
					return ImageController.getOrCreate( "iap", data.bgImg );
			})
			.catch( ( error ) => {
				throw error;
			})
			.then( ( image ) => {

				if ( image )
					this_image = image;

				return IapStat.findOne({
					iap: this_iap._id,
					feed: feed._id,
				}).sort({ date: "desc" });

			})
			.then( ( stat ) => {
				// create stat if it doesn't exist,
				// or if the values have changed (ignoring missing ),
				// or if the stat was missing but is back
				let image_check = ( ! stat ) ? false : ( this_image ) ? ( stat.image.toString() !== this_image._id.toString() ) : true;
				if (
					! stat ||
					stat.missing ||
					(
						(
							stat.amount !== data.amount ||
							image_check ||
							stat.enabled !== data.enabled ||
							stat.USD !== data.priceAnalyticsUSD ||
							stat.CNY !== data.priceGiantCNY
						) && ! stat.missing
					)
				) {
					let image_id = ( this_image ) ? this_image._id : null;
					return IapStat.create({
						iap: this_iap._id,
						date: date,
						amount: data.amount,
						image: image_id,
						enabled: data.enabled,
						USD: data.priceAnalyticsUSD,
						CNY: data.priceGiantCNY,
						feed: feed._id,
					});
				}
				else {
					return stat;
				}
			})
			.then( ( stat ) => {
				return resolve( { category: "iap", stats: [ stat ] } );
			})
			.catch( ( error ) => {
				return reject( error );
			});

	});
};

const checkAndAddMissingStat = function( stat ) {

	return new Promise( ( resolve, reject ) => {

		if ( stat && ! stat.missing ) {
			
			IapStat.create({
				iap: stat.iap,
				date: new Date(),
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

const getAllStatsLatest = function( feed ) {
	return IapStat.aggregate([
		{ $match: { feed: feed._id } },
		{ $sort: { date: -1 } },
		{ $group: {
			_id: "$iap",
			stat: { $first: "$$CURRENT" },
		}},
	]);
};

module.exports = {
	getOrCreate: getOrCreate,
	createStat: createStat,
	checkAndAddMissingStat: checkAndAddMissingStat,
	getAllStatsLatest: getAllStatsLatest,
};