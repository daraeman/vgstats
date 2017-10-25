const Image = require( "../model/Image" );
const fs = require( "fs.promised" );
const request = require( "request-promise-native" );

const save_folder = "../data/images/";

const createPath = function( md5 ) {
	return save_folder + md5;
};

const create = function( url, name, md5 ) {
	return new Promise( ( resolve, reject ) => {

		let image = new Image({
			name: name,
			md5: md5,
			url: url,
		});

		image.save()
			.then( () => {
				return resolve();
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const get = function( image ) {
	return new Promise( ( resolve, reject ) => {

		request( image.url )
			.then( ( body ) => {
				return fs.writeFile( createPath( image.md5 ), body );
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

const existsDB = function( md5 ) {
	return Image.findOne( { md5: md5 } );
};

const existsFile = function( md5 ) {
	return new Promise( ( resolve, reject ) => {
		fs.access( createPath( md5 ), fs.constants.R_OK )
			.then( () => {
				return resolve( true );
			})
			.catch( ( error ) => {
				return resolve( false );
			})
	});
};