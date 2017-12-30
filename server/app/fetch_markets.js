const db = require( "../controller/db" );
const PromiseEndError = require( "../controller/PromiseEndError" );
const FeedController = require( "../controller/Feed" );
require( "dotenv" ).config();
const Queue = require( "simple-promise-queue" );
let queue = new Queue({
	autoStart: true,
	concurrency: 1,
});
const Utils = require( __dirname + "/../controller/Utils" );
const log = require( "../controller/Log" )( require( "path" ).resolve( __dirname, "../../log/fetch_markets" ) );


const loop_delay = ( 1000 * 60 ); // check for feeds needing updating once every minute
const request_delay = ( 1000 * 10 ); // don't hit servers more than once every 10 seconds

function callback() {

	log.info( "loop" );

	return new Promise( ( resolve, reject ) => {

		let date = new Date();

		let this_feeds;
		db.connect()
			.then(() => {
				return FeedController.getFeedToFetchAll( "market" );
			})
			.then( ( feeds ) => {

				if ( ! feeds || ! feeds.length )
					throw new PromiseEndError( "Nothing to fetch" );

				this_feeds = feeds;

				log.info( "["+ feeds.length +"] feeds found to fetch" );

				let feed_jobs = [];
				feeds.forEach( ( feed ) => {
					feed_jobs.push( queue.pushTask( function( resolve ) {

						// if our request is quicker than request_delay,
						// timeout for the difference of the time
						let start_time = +new Date();
						FeedController.retrieveFeed( feed, date )
							.then( ( json ) => {
								feed.json = json;
								let end_time = +new Date();
								let diff = ( end_time - start_time );
								let delay = ( diff >= request_delay ) ? 0 : ( request_delay - diff );
								setTimeout( () => {
									resolve();
								}, delay );
							});
						
					}) );
				});

				return Promise.all( feed_jobs );

			})
			.then( () => {
				db.close();
				return resolve();
			})
			.catch( ( error ) => {
				db.close();
				if ( error.name === "MongoError" || error.name === "MongooseError" ) {
					log.error( error );
					return resolve( 1000 * 5 );
				}
				else if ( error instanceof PromiseEndError ) {
					return resolve();
				}
				else {
					// we don't want the loop to die, so resolve instead of reject
					log.error( error );
					return resolve();
				}
			});
	});

}

Utils.loop( callback, loop_delay );