const fs = require( "fs.promised" );

const loop = function( callback, delay ) {

	callback().then( () => {

		setTimeout( () => {
			loop( callback, delay );
		}, delay );

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

module.exports = {
	loop: loop,
	openLog: openLog,
	getCurrencies: getCurrencies,
};