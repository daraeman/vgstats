const db = require( __dirname + "/../controller/db" );
const ActionController = require( __dirname + "/../controller/Action" );
const BoostController = require( __dirname + "/../controller/Boost" );
const BundleController = require( __dirname + "/../controller/Bundle" );
const HeroController = require( __dirname + "/../controller/Hero" );
const IapController = require( __dirname + "/../controller/Iap" );
const SkinController = require( __dirname + "/../controller/Skin" );
const FeedController = require( __dirname + "/../controller/Feed" );
const PromiseEndError = require( __dirname + "/../controller/PromiseEndError" );
require( "dotenv" ).config( __dirname + "/../../.env" );
const Queue = require( "simple-promise-queue" );
let queue = new Queue({
	autoStart: true,
	concurrency: 1,
});
const Utils = require( __dirname + "/../controller/Utils" );
const log_path = __dirname + "/../../log/update_markets";
let logStream = Utils.openLog( log_path );
function log( msg ) {
	logStream.write( "["+ new Date() +"] " + msg + "\n" );
}

process.on( "uncaughtException", ( error ) => {
    log( error.stack );
});

log ( "--------------------------------------" );

const loop_delay = ( 1000 * 60 ); // check for feeds needing updating every 60 seconds
const request_delay = ( 1000 * 10 ); // don't hit servers more thatn once every 10 seconds

function callback() {

	return new Promise( ( resolve, reject ) => {

		let this_feeds;
		FeedController.getFeedToFetchAll( "market" )
			.then( ( feeds ) => {

				if ( ! feeds || ! feeds.length )
					throw new PromiseEndError( "Nothing to fetch" );

				this_feeds = feeds;

				log( "["+ feeds.length +"] feeds found to fetch" );

				let feed_jobs = [];
				feeds.forEach( ( feed ) => {
					feed_jobs.push( queue.pushTask( function( resolve ) {

						// if our request is quicker than request_delay,
						// timeout for the difference of the time
						let start_date = +new Date();
						FeedController.retrieveFeed( feed )
							.then( ( json ) => {
								feed.json = json;
								let end_date = +new Date();
								let diff = ( end_date - start_date );
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

					let items_remaining = 0;
					let item_jobs = [];
					this_feeds.forEach( ( feed ) => {

						let data;
						try {
							data = JSON.parse( feed.json );
						} catch ( error ) {
							throw error; // log error here and continue
						}

						items_remaining += data.items.length;
						data.items.forEach( ( item ) => {

							let item_promise;
							if ( item.category === "iap" )
								item_promise = IapController.createStat;
							else if ( item.category === "boost" )
								item_promise = BoostController.createStat;
							else if ( item.category === "hero" )
								item_promise = HeroController.createStat;
							else if ( item.category === "socialActions" )
								item_promise = ActionController.createStat;
							else if ( item.category === "bundle" )
								item_promise = BundleController.createStat;
							else if ( item.category === "skin" )
								item_promise = SkinController.createStat;
							else {
								log( "Unknown item", JSON.stringify( item ) );
								if ( --items_remaining === 0 ) {
									return resolve();
								}
								else {
									return;
								}
							}

							item_jobs.push( queue.pushTask( function( resolve ) {
								item_promise( item, feed )
									.then( () => {
										resolve();
									});
							}) );

						});
					});

				return Promise.all( item_jobs );

			})
			.then( () => {
				return resolve();
			})
			.catch( ( error ) => {
				if ( ! ( error instanceof PromiseEndError ) )
					return reject( error );
				return resolve();
			});
	});

}

db.connect()
	.then(() => {
		log( "DB connected, starting" );
		Utils.loop( callback, loop_delay );
	})
	.catch( ( error ) => {
		log( error );
		db.close();
	});