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
		getOrCreate( data )
			.then( ( iap ) => {

				return ImageController.getOrCreate( "iap", data.bgImg )
					.then( ( image ) => {

						if ( ! image )
							throw new Error( "Failed to getOrCreate image [%s]", data.image );

						this_image = image;

						return IapStat.findOne({
							iap: iap._id,
							feed: feed._id,
						}).sort({ date: "desc" });
					})
					.then( ( stat ) => {
						// create stat if it doesn't exist,
						// or if the values have changed (ignoring missing ),
						// or if the stat was missing but is back
						if (
							! stat ||
							stat.missing ||
							(
								(
									stat.amount !== data.amount ||
									stat.image.toString() !== this_image._id.toString() ||
									stat.enabled !== data.enabled ||
									stat.USD !== data.priceAnalyticsUSD ||
									stat.CNY !== data.priceGiantCNY
								) && ! stat.missing
							)
						) {
							return IapStat.create({
								iap: iap._id,
								date: date,
								amount: data.amount,
								image: this_image._id,
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