const Image = require( "../model/Image" );
const fs = require( "fs.promised" );
const crypto = require( "crypto" );
const request = require( "request-promise-native" );
const PromiseBreakError = require( "./PromiseBreakError" );
const Utils = require( "./Utils" );

const url_domain = "http://gamefeeds.superevilmegacorp.net";
const save_folder = __dirname + "/../data/images/";

const refetch_image_interval_days = 15;

function createPath( hash ) {
	return save_folder + hash;
}

const retrieve = function( image ) {
	return new Promise( ( resolve, reject ) => {

		request( { url: image.url, encoding: "binary" } )
			.then( ( body ) => {
				let sha256 = crypto.createHash( "sha256" ).update( body ).digest( "hex" );
				if ( image.sha256 === sha256 )
					throw new PromiseBreakError( "Image not changed" );
				image.sha256 = sha256;
				image.previous.push( sha256 );
				return fs.writeFile( createPath( sha256 ), body, "binary" );
			})
			.catch( ( error ) => {
				if ( error instanceof PromiseBreakError )
					return;
				throw error;
			})
			.then( () => {
				image.error = null;
				image.fetched = new Date();
				return image.save();
			})
			.then( ( image ) => {
				return resolve( image );
			})
			.catch( ( error ) => {
				image.error = JSON.stringify( error );
				image.save();
				return reject( error );
			});
	});
};

function existsDB( name ) {
	return Image.findOne( { name: name } );
}

const existsFile = function( hash ) {
	return new Promise( ( resolve ) => {
		fs.access( createPath( hash ), fs.constants.R_OK )
			.then( () => {
				return resolve( true );
			})
			.catch( () => {
				return resolve( false );
			});
	});
};

const getOrCreate = function( type, name, url ) {
	return new Promise( ( resolve, reject ) => {
		existsDB( name )
			.then( ( image ) => {
				if ( ! image ) {

					url = ( url ) ? Utils.expandUrl( url ) : createUrl( type, name );

					return Image.create({
						url: url,
						name: name,
					});

				}
				else {
					return image;
				}
			})
			.then( ( image ) => {
				if ( ! image )
					throw new Error( "Image not returned after creating" );
				return resolve( image );
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

function createUrl( type, name ) {
	if (
		type === "hero" ||
		type === "iap" ||
		type === "action" ||
		type === "boost" ||
		type === "bundle" ||
		type === "skin"
	) {
		return url_domain + "/market/current/" + name;
	}
}

const getImagesToFetchAll = function() {

	let fetch_interval = new Date();
		fetch_interval.setDate( fetch_interval.getDate() - refetch_image_interval_days );

	return Image.find({
		$or: [
			{ fetched: { $eq: null } },
			{ fetched: { $lt: fetch_interval } },
		],
		error: { $eq: null }
	}).sort({ date: 1 }).limit( 2 );

};

module.exports = {
	retrieve: retrieve,
	getOrCreate: getOrCreate,
	existsFile: existsFile,
	getImagesToFetchAll: getImagesToFetchAll,
};