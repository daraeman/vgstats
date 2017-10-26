const Video = require( "../model/Video" );
const fs = require( "fs.promised" );
const crypto = require( "crypto" );
const request = require( "request-promise-native" );

const save_folder = __dirname + "/../data/videos/";

function createPath( hash ) {
	return save_folder + hash;
}

const retrieve = function( video ) {
	return new Promise( ( resolve, reject ) => {

		request( video.url )
			.then( ( body ) => {
				let sha256 = crypto.createHash( "sha256" ).update( body ).digest( "hex" );
				video.sha256 = sha256;
				return fs.writeFile( createPath( sha256 ), body );
			})
			.then( () => {
				video.fetched = new Date();
				return video.save();
			})
			.then( () => {
				return resolve();
			})
			.catch( ( error ) => {
				video.error = JSON.stringify( error );
				video.save();
				return reject( error );
			});
	});
};

function existsDB( url ) {
	return Video.findOne( { url: url } );
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

const getOrCreate = function( url ) {
	return new Promise( ( resolve, reject ) => {
		
		existsDB( url )
			.then( ( video ) => {
				if ( ! video ) {
					return Video.create({
						url: url,
					});
				}
				else {
					return video;
				}
			})
			.then( ( video ) => {
				if ( ! video ) {
					throw new Error( "Video not returned after creating" );
				}
				return resolve( video );
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

module.exports = {
	retrieve: retrieve,
	getOrCreate: getOrCreate,
	existsFile: existsFile,
};