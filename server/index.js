require( "dotenv" ).config();

const base = process.cwd();
process.env.BASE = base;

let apps = {
	update_markets: {
		main: base + "/server/app/process_markets.js",
		name: "process_markets",
		pidfile: base + "/pids/process_markets.pid",
	},
	fetch_markets: {
		main: base + "/server/app/fetch_markets.js",
		name: "ufetch_markets",
		pidfile: base + "/pids/fetch_markets.pid",
	},
	web_server: {
		main: base + "/server/app/web_server.js",
		name: "web_server",
		pidfile: base + "/pids/web_server.pid",
	},
};

Object.keys( apps ).forEach( ( name ) => {
	apps[ name ].daemon = require( "daemonize2" ).setup( apps[ name ] );
});

function printStatus( name ) {
	let pid = apps[ name ].daemon.status();
	let status = ( pid ) ? "Running ["+ pid +"]" : "Not Running";
	console.log( "Status of", name, status );
}

function start( name ) {
	apps[ name ].daemon.start();
	printStatus( name );
}

function status( name ) {
	printStatus( name );
}

function stop( name ) {
	apps[ name ].daemon.stop();
}

function start_all() {
	Object.keys( apps ).forEach( ( name ) => {
		start( name );
	});
}

function status_all() {
	Object.keys( apps ).forEach( ( name ) => {
		printStatus( name );
	});
}

function stop_all() {
	Object.keys( apps ).forEach( ( name ) => {
		stop( name );
	});
}

const app_string = Object.keys( apps ).join( "|" );
const regex = new RegExp( "^("+ app_string +")$" );

function isValidApp( name ) {
	return regex.test( name );
}

function init( action, name ) {

	if ( action === "start_all" )
		start_all();
	else if ( action === "status_all" )
		status_all();
	else if ( action === "stop_all" )
		stop_all();
	else if ( action === "start" && isValidApp( name ) )
		start( name );
	else if ( action === "status" && isValidApp( name ) )
		status( name );
	else if ( action === "stop" && isValidApp( name ) )
		stop( name );
	else
		console.log( "Usage: [start|status|stop|start_all|status_all|stop_all] ["+ app_string +"]" );
}

init( process.argv[2], process.argv[3] );
