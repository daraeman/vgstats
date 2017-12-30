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
const fs = require( "fs-extra" );
require( "dotenv" ).config();
/*
const Queue = require( "simple-promise-queue" );
let queue = new Queue({
	autoStart: true,
	concurrency: 1,
});
const Utils = require( __dirname + "/../controller/Utils" );
*/
const watch = require( "node-watch" );
const path = require( "path" );
const log = require( "../controller/Log" )( path.resolve( __dirname, "../../log/parse_markets" ) );


log.info( "--------------------------------------" );

function process( feed, file_path ) {

	return new Promise( ( resolve, reject ) => {

		log.info( "file_path [" + file_path + "]" );
		let date_matches = file_path.match( /(\d+)\.json$/ );
		let date = new Date( +date_matches[1] );

		fs.readFile( file_path )
			.then( ( json ) => {
				return JSON.parse( json );
			})
			.then( ( data ) => {

				log.info( "data: " + data );
				log.info( "feed.change_ids: " + feed.change_ids );

				if ( feed.change_ids.indexOf( data.rendered ) === -1 ) {
					log.info( "a" );

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
							log.info( "b" );

							all_stats = response;

							return IapController.getAllStatsLatest( feed );
						})
						.then( ( response ) => {
							log.info( "c" );

							all_iap_stats = response;

							feed.change_ids.push( data.rendered );
							feed.save();

							let items_remaining = data.items.length;
							let item_jobs = [];

							data.items.forEach( ( item, i ) => {
							//	log.info( "d", i );

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
									log.warn( "Unknown item", JSON.stringify( item ) );

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
												log.error( error );
												return reject( error );
											});
									 })
								);
							});

							Promise.all( item_jobs )
								.then( () => {
									log.info( "e" );

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
											log.info( "f" );
											return resolve();
										})
										.catch( ( error ) => {
											log.error( error );
											throw error;
										});
								})
								.catch( ( error ) => {
									log.error( error );
									throw error;
								});

						});

				}
				else {
					log.info( "g" );
					return resolve();
				}
			})
			.catch( ( error ) => {
				log.error( error );
				if ( ! ( error instanceof PromiseEndError ) )
					return reject( error );
				return resolve();
			});
	});

}

function start() {
	log.info( "start" );
	db.connect()
		.catch( ( error ) => {

				if ( error.name === "MongoError" || error.name === "MongooseError" ) {
					if ( /failed to connect to server/.test( error.message ) ) {
						log.error( "Failed to connect to to database, retrying in 5 seconds" );
						setTimeout( () => {
							start();
						}, 5000 );
					}
					else {
						log.error( "Database Error" );
					}
				}

				throw error;                                                                                                       
			})
			.then( () => {
				log.info( "DB connected, starting" );
				return FeedController.getFeeds( "market" );
			})
			.then( ( feeds ) => {
				log.info( "!!!!!!!!!!!!!!! FEEDS: " + feeds.length );

				if ( ! feeds.length )
					throw new PromiseEndError( "No Feeds Found" );

				feeds.forEach( ( feed ) => {
					let unparsed_dir = path.resolve( FeedController.createSavePath( feed.path ), "unparsed" );
					let parsed_dir = path.resolve( FeedController.createSavePath( feed.path ), "parsed" );

					// parse any existing unparsed files
					fs.readdir( unparsed_dir )
						.then( ( items ) => {
							items.forEach( ( file_name ) => {
								process( feed, path.resolve( unparsed_dir, file_name ) )
									.then( () => {
										log.info( "parsed_dir ["+ parsed_dir +"]" );
										log.info( "manual moving file [" + path.resolve( unparsed_dir, file_name ) + "] [" + path.resolve( parsed_dir, file_name ) + "]" );
										return fs.rename( path.resolve( unparsed_dir, file_name ), path.resolve( parsed_dir, file_name ) );
									});
							});
						});

					log.info( "Watching: ", unparsed_dir );

					// watch dir and parse new files as they come in
					watch(
						unparsed_dir + "/",
						{ recursive: true },
						function( event, file_path ) {
							let file_name = path.basename( file_path );
							if ( event === "update" ) {
								let parsed_path = path.resolve( parsed_dir, file_name );
								let unparsed_path = path.resolve( unparsed_dir, file_name );
								process( feed, unparsed_path )
									.then( () => {
										return fs.rename( unparsed_path, parsed_path );
									});
							}
						}
					);
				});
			})
			.catch( ( error ) => {
				if ( error instanceof PromiseEndError )
					log.info( error );
				else
					log.error( error );
				db.close();
			});

}

log.info( "before start" );

start();