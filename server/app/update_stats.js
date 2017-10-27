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

db.connect()
	.then( () => {
		return FeedController.getFeedToFetchAll( "market" );
	})
	.then( ( feeds ) => {

		if ( ! feeds || ! feeds.length )
			throw new PromiseEndError( "Nothing to fetch" );

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
			console.log( "a" );

			let items_remaining = 0;
			feeds.forEach( ( feed ) => {

				let data;
				try {
					data = JSON.parse( feed.json );
				} catch ( error ) {
					throw error; // log error here and continue
				}

				items_remaining += data.items.length;
				let temp_items = JSON.parse( JSON.stringify( data.items ) );
				data.items.forEach( ( item, index ) => {

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
						console.log( "Unknown item", JSON.stringify( item ) );
						return;
						//throw new Error( "unrecognized item >> ", JSON.stringify( item ) ); // log error here and continue
					}

					item_promise( item, feed )
						.then( () => {
							console.log( "b 2 [%s]", ( --items_remaining - 1 ) );
							temp_items.splice( index, 1 );
							if ( items_remaining < 58 )
								console.log( temp_items )
							if ( --items_remaining === 0 )
								db.close();
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
			throw error;
		console.log( "Nothing to Fetch" );
		db.close();
	});