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

log ( "--------------------------------------" )

const fetch_delay = ( 1000 * 60 ); // 60 seconds

function callback() {

	return new Promise( ( resolve, reject ) => {

		FeedController.getFeedToFetchAll( "market" )
			.then( ( feeds ) => {

				if ( ! feeds || ! feeds.length )
					throw new PromiseEndError( "Nothing to fetch" );

				log( "["+ feeds.length +"] feeds found to fetch" );

				let feed_jobs = [];
				feeds.forEach( ( feed ) => {
					feed_jobs.push( queue.pushTask( ( resolve ) => {
						FeedController.retrieveFeed( feed )
							.then( ( json ) => {
								feed.json = json;
								resolve();
							});
					}) );
				});

				Promise.all( feed_jobs ).then( () => {

					let items_remaining = 0;
					feeds.forEach( ( feed ) => {

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
									db.close();
									return resolve();
								}
								else {
									return;
								}
							}

							item_promise( item, feed )
								.then( () => {
									if ( --items_remaining === 0 ) {
										db.close();
										return resolve();
									}
								})
								.catch( ( error ) => {
									throw error;
								});
						});

					});
				});
			})
			.catch( ( error ) => {
				if ( ! ( error instanceof PromiseEndError ) )
					return reject( error );
				log( error );
				return resolve();
			});
	});

}

db.connect()
	.then(() => {
		log( "DB connected, starting" );
		Utils.loop( callback, fetch_delay );
	})
	.catch( ( error ) => {
		log( error );
		db.close();
	});