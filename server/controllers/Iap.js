const Iap = require( "../model/Iap" );
const IapStat = require( "../model/IapStat" )
const ImageController = require( "../controller/Image" );

const getOrCreate = function( iap ) {
	return new Promise( ( resolve, reject) => {
		Iap.findOne( { id: iap.productID } )
			.then( ( iap ) => {
				if ( ! iap ) {
					return Iap.create({
						type: iap.type
						id: iap.productID
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

const createStat = function( data ) {
	return new Promise( ( resolve, reject ) => {
		getOrCreate( data )
			.then( ( iap ) => {

				return ImageController.getOrCreate( "iap", data.bgImg )
					.then( ( image ) => {

						if ( ! image )
							throw new Error( "Failed to getOrCreate [%s]", data.image );

						return IapStat.create({
							id: iap._id,
							date: new Date(),
							amount: data.amount,
							image_id: image._id,
							enabled: data.enabled,
							USD: data.priceAnalyticsUSD,
							CNY: data.priceGiantCNY,
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