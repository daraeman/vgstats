const db = require( "../controller/db" );
const ActionController = require( "../controller/Action" );
const BoostController = require( "../controller/Boost" );
const BundleController = require( "../controller/Bundle" );
const HeroController = require( "../controller/Hero" );
const IapController = require( "../controller/Iap" );
const StatController = require( "../controller/Stat" );
const SkinController = require( "../controller/Skin" );
const FeedController = require( "../controller/Feed" );
const PromiseEndError = require( "../controller/PromiseEndError" );
require( "dotenv" ).config();
const Queue = require( "simple-promise-queue" );
let queue = new Queue({
	autoStart: true,
	concurrency: 1,
});
const Utils = require( __dirname + "/../controller/Utils" );
const log_path = __dirname + "/../../log/update_markets";
let logStream = Utils.openLog( log_path );
function log( msg ) {
	console.log( msg );
	//logStream.write( "["+ new Date() +"] " + msg + "\n" );
}

process.on( "uncaughtException", ( error ) => {
    log( error );
});

log ( "--------------------------------------" );

const loop_delay = ( 1000 * 60 ); // check for feeds needing updating every 60 seconds
const request_delay = ( 1000 * 10 ); // don't hit servers more thatn once every 10 seconds

function callback() {

	return new Promise( ( resolve, reject ) => {

		let date = new Date();

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

				let feeds_remaining = this_feeds.length;
				this_feeds.forEach( ( feed ) => {

					let data;
					try {
						data = JSON.parse( feed.json );
					} catch ( error ) {
						throw error;
					}

					if ( data.rendered != feed.change_id ) {

						function removeStat( category, stat_id ) {
							
							if ( category === "iap" ) {
								
								all_iap_stats = all_iap_stats.filter( ( stat ) => {
									return ( stat._id.toString() != stat_id.toString() );
								});
							}
							else if ( /^boost|bundle|hero|skin|action$/.test( category ) ) {

								all_stats = all_stats.filter( ( stat ) => {
									return ( stat._id != stat_id );
								});
							}
						}

						// get list of all stats with feed.id and only last of each item
						// by process of elimination we can get items that have been dropped
						let all_stats;
						let all_iap_stats;
						StatController.getAllStatsLatest( feed )
							.then( ( response ) => {

								all_stats = response;

								return IapController.getAllStatsLatest( feed );
							})
							.then( ( response ) => {

								all_iap_stats = response;

								feed.change_id = data.rendered;
								feed.save();

								let items_remaining = data.items.length;
								let item_jobs = [];

								data.items.forEach( ( item ) => {

									let item_promise;
									if ( item.category === "iap" )
										item_promise = IapController.createStat;
									else if ( item.category === "socialActions" )
										item_promise = ActionController.createStat;
									else if ( item.category === "boost" )
										item_promise = BoostController.createStat;
									else if ( item.category === "bundle" )
										item_promise = BundleController.createStat;
									else if ( item.category === "hero" )
										item_promise = HeroController.createStat;
									else if ( item.category === "skin" )
										item_promise = SkinController.createStat;
									else {
										log( "Unknown item", JSON.stringify( item ) );

										if ( --items_remaining === 0 ) {
											return resolve();
										}
										else
											return;
									}

									item_jobs.push(
										new Promise( ( resolve, reject ) => {
											item_promise( item, feed, date )
												.then( ( response ) => {
													response.stats.forEach( ( stat ) => {
														let id = stat.iap || stat.id;
														removeStat( response.category, id );
													});
													return resolve();
												}).catch( ( error ) => {
													log( error.toString() );
													return reject( error );
												});
										 })
									);
								});

								Promise.all( item_jobs )
									.then( () => {

										let missing_jobs = [];

										if ( all_iap_stats.length ) {

											all_iap_stats.forEach( ( iap_stat ) => {
												missing_jobs.push( IapController.checkAndAddMissingStat( iap_stat.stat ) );
											});
										}

										if ( all_stats.length ) {

											all_stats.forEach( ( stat ) => {

												let s = stat.stat;
												
												if ( s.action )
													missing_jobs.push( ActionController.checkAndAddMissingStat( s ) );
												else if ( s.bundle )
													missing_jobs.push( BundleController.checkAndAddMissingStat( s ) );
												else if ( s.boost )
													missing_jobs.push( BoostController.checkAndAddMissingStat( s ) );
												else if ( s.hero )
													missing_jobs.push( HeroController.checkAndAddMissingStat( s ) );
												else if ( s.skin )
													missing_jobs.push( SkinController.checkAndAddMissingStat( s ) );

											});
										}

										Promise.all( missing_jobs )
											.then( () => {
												if ( --feeds_remaining === 0 ) {
													return resolve();
												}
											})
											.catch( ( error ) => {
												log( error.toString() );
												throw error;
											});
									})
									.catch( ( error ) => {
										log( error.toString() );
										throw error;
									});

							});

					}
					else {
						if ( --feeds_remaining === 0 ) {
							return resolve();
						}
					}
				});
			})
			.catch( ( error ) => {
				if ( ! ( error instanceof PromiseEndError ) ) {
					return reject( error );
				}
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
		log( error.toString() );
		db.close();
	});