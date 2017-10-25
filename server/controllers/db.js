const mongoose = require( "mongoose" );
require( "dotenv" ).config();

const connect = function( db_name ) {

	db_name = db_name || process.env.DB_NAME;
	const db_url = "mongodb://"+ process.env.DB_HOST + ":"+ process.env.DB_PORT +"/"+ db_name;

	return new Promise( ( resolve, reject ) => {

		let connection_params = {};

		// if database needs authentication
		if ( process.env.DB_USER && process.env.DB_PASSWORD ) {
			connection_params = {
				user: process.env.DB_USER,
				pass: process.env.DB_PASSWORD,
				auth: {
					authdb: db_name
				}
			}
		}

		mongoose.connect( db_url, connection_params )
			.then( () => {

				if ( mongoose.connection.readyState !== 1 )
					throw new Error( "DB not connected state["+ mongoose.connection.readyState +"]" );

				return resolve();
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const close = function() {
	return mongoose.connection.close();
};

module.exports = {
	connect: connect,
	close: close,
	mongoose: mongoose,
};