const fs = require( "fs.promised" );
const mongo_conf = "mongo.conf";
const mongo_conf_sample = "mongo.conf.sample";
const mongo_log = "log/mongo.log";
const env_file = ".env";
const env_template = ".env.sample";

// check mongo conf exists
fs.access( mongo_conf, fs.constants.F_OK | fs.constants.W_OK )
	.then( () => {
		console.log( "Mongo Conf Already Exists" );
	})
	.catch( () => {
		// create blank mongo log
		fs.createReadStream( mongo_conf_sample ).pipe( fs.createWriteStream( mongo_conf ) );
		console.log( "Mongo Conf Created" );
	})
	.then( () => {
		return fs.access( mongo_log, fs.constants.F_OK | fs.constants.W_OK );
	})
	.then( () => {
		console.log( "Mongo Log Already Exists" );
	})
	.catch( () => {
		// create blank mongo log
		return fs.writeFile( mongo_log, "" );
		console.log( "Mongo Log Created" );
	})
	.catch( ( error ) => {
		// error creating mongo log
		throw error;
	})
	.then( () => {
		// check envronment file exists
		return fs.access( env_file, fs.constants.F_OK | fs.constants.W_OK );
	})
	.then( () => {
		console.log( "Environment File Already Exists" );
	})
	.catch( () => {
		// create environment file from the sample
		fs.createReadStream( env_template ).pipe( fs.createWriteStream( env_file ) );
		console.log( "Blank Environment File Created" );
	})
	.catch( ( error ) => {
		throw error;
	});