const fs = require( "fs.promised" );
const static_url = "http://static.superevil.net/";

const loop = function( callback, delay ) {

	callback().then( ( custom_delay ) => {
		let this_delay = custom_delay || delay;
		setTimeout( () => {
			loop( callback, delay );
		}, this_delay );

	});
};

const openLog = function( logfile ) {
	return fs.createWriteStream( logfile, {
		flags: "a",
		encoding: "utf8",
		mode: 0o644,
	});
};

const getCurrencies = function() {
	return [ "gold", "silver", "opal" ];
};

const expandUrl = function( url ) {
	url = url.replace( "[STATICCONTENTURL]", static_url );
	return url;
};

module.exports = {
	loop: loop,
	openLog: openLog,
	getCurrencies: getCurrencies,
	expandUrl: expandUrl,
};