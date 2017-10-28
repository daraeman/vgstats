const Iap = require( "../model/Iap" );
const IapStat = require( "../model/IapStat" );
const ImageController = require( "../controller/Image" );

const getOrCreate = function( data ) {
	return new Promise( ( resolve, reject ) => {

		Iap.findOne( { id: data.productID } )
			.then( ( iap ) => {
				if ( ! iap ) {
					return Iap.create({
						type: data.type,
						id: data.productID,
					});
				}
				else {
					return iap;
				}
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

const createStat = function( data, feed ) {
	return new Promise( ( resolve, reject ) => {
		getOrCreate( data )
			.then( ( iap ) => {

				return ImageController.getOrCreate( "iap", data.bgImg )
					.then( ( image ) => {

						if ( ! image )
							throw new Error( "Failed to getOrCreate [%s]", data.image );

						IapStat.findOne({
							id: iap._id,
							feed: feed._id,
						}).sort({ date: "desc" })
							.then( ( stat ) => {
								if (
									! stat ||
									stat.amount !== data.amount ||
									stat.image !== image._id ||
									stat.enabled !== data.enabled ||
									stat.USD !== data.priceAnalyticsUSD ||
									stat.CNY !== data.priceGiantCNY
								) {
									return IapStat.create({
										id: iap._id,
										date: new Date(),
										amount: data.amount,
										image: image._id,
										enabled: data.enabled,
										USD: data.priceAnalyticsUSD,
										CNY: data.priceGiantCNY,
										feed: feed._id,
									});
								}
							})
							.then( () => {
								return resolve();
							});
					})
					.then( () => {
						return resolve();
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