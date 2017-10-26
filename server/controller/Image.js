const Image = require( "../model/Image" );
const fs = require( "fs.promised" );
const crypto = require( "crypto" );
const request = require( "request-promise-native" );

const url_domain = "gamefeeds.superevilmegacorp.net";
const save_folder = __dirname + "/../data/images/";

function createPath( hash ) {
	return save_folder + hash;
}

const retrieve = function( image ) {
	return new Promise( ( resolve, reject ) => {

		request( image.url )
			.then( ( body ) => {
				let sha256 = crypto.createHash( "sha256" ).update( body ).digest( "hex" );
				image.sha256 = sha256;
				return fs.writeFile( createPath( sha256 ), body );
			})
			.then( () => {
				image.fetched = new Date();
				return image.save();
			})
			.then( () => {
				return resolve();
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

const getOrCreate = function( type, name ) {
	return new Promise( ( resolve, reject) => {
		existsDB( name )
			.then( ( image ) => {
				if ( ! image ) {
					return Image.create({
						url: createUrl( type, name ),
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

module.exports = {
	retrieve: retrieve,
	getOrCreate: getOrCreate,
	existsFile: existsFile,
};