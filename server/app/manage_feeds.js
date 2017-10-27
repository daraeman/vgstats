const db = require( __dirname + "/../controller/db" );
const FeedController = require( __dirname + "/../controller/Feed" );
const readline = require( "readline" );
require( "dotenv" ).config( __dirname + "/../../.env" );

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function command( message ) {
	if ( message === "help" ) {
		message = null;
		console.log( "Feed Manager" );
		console.log( "Commands:" );
		console.log( " - list" );
		console.log( " - add URL LANGUAGE REGION PLATFORM TYPE INTERVAL ENABLED PATH" );
		console.log( " - update URL LANGUAGE REGION PLATFORM TYPE INTERVAL ENABLED PATH" );
		console.log( " - delete URL" );
		console.log( " - disable URL" );
		console.log( " - enable URL" );
		console.log( "-----------------------------------------" );
	}
	message = message || "Enter Command: ";
	rl.question( message, ( answer ) => {
		if ( answer === "list" || answer === "ls" ) {
			FeedController.getAll()
				.then( ( feeds ) => {
					feeds.forEach( ( feed ) => {
						let parts = [
							feed.url,
							feed.language,
							feed.region,
							feed.platform,
							feed.type,
							feed.interval,
							feed.enabled,
							feed.path,
						];
						console.log( parts.join( " " ) );
					});
					command();
				});
		}
		else if ( /^add/.test( answer ) ) {
			let parts = answer.split( " " );
			if ( parts.length < 2 || ! parts[1] ) {
				command( "Invalid parameters: 'add URL LANGUAGE REGION PLATFORM TYPE INTERVAL ENABLED PATH'" );
				return;
			}
			let url = parts[1];
			let language = parts[2];
			let region = parts[3];
			let platform = parts[4];
			let type = parts[5];
			let interval = parts[6];
			let enabled = parts[7];
			let path = parts[8];
			FeedController.add( url, language, region, platform, type, interval, enabled, path )
				.then( ( feed ) => {
					console.log( "Feed added: ", feed );
					command();
				});
		}
		else if ( /^update/.test( answer ) ) {
			let parts = answer.split( " " );
			if ( parts.length < 2 || ! parts[1] ) {
				command( "Invalid parameters: 'update URL LANGUAGE REGION PLATFORM TYPE INTERVAL ENABLED PATH'" );
				return;
			}
			let url = parts[1];
			let language = parts[2];
			let region = parts[3];
			let platform = parts[4];
			let type = parts[5];
			let interval = parts[6];
			let enabled = parts[7];
			let path = parts[8];
			FeedController.update( url, language, region, platform, type, interval, enabled, path )
				.then( ( feed ) => {
					console.log( "Feed updated: ", feed );
					command();
				});
		}
		else if ( /^delete|rm/.test( answer ) ) {
			let parts = answer.split( " " );
			if ( parts.length < 1 || ! parts[1] ) {
				command( "Invalid parameters: 'remove URL'" );
				return;
			}
			let url = parts[1];
			FeedController.remove( url )
				.then( () => {
					console.log( "Feed deleted");
					command();
				});
		}
		else if ( /^disable/.test( answer ) ) {
			let parts = answer.split( " " );
			if ( parts.length < 1 || ! parts[1] ) {
				command( "Invalid parameters: 'disable URL'" );
				return;
			}
			let url = parts[1];
			FeedController.disable( url )
				.then( () => {
					console.log( "Feed disabled");
					command();
				});
		}
		else if ( /^enable/.test( answer ) ) {
			let parts = answer.split( " " );
			if ( parts.length < 1 || ! parts[1] ) {
				command( "Invalid parameters: 'enable URL'" );
				return;
			}
			let url = parts[1];
			FeedController.enable( url )
				.then( () => {
					console.log( "Feed enabled");
					command();
				});
		}
		else if ( answer === "exit" )  {
			rl.close();
			db.close();
		}
		else  {
			command( "help" );
		}
	});
}

db.connect()
	.then( () => {
		command( "help" );
	});