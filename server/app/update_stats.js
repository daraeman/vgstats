const request = require( "request-promise-native" );
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

db.connect()
	.then( () => {
		return FeedController.getFeedToFetch();
	})
	.then( ( feed ) => {
		if ( ! feed )
			throw new PromiseEndError( "Nothing to fetch" );
		return FeedController.getFeed( feed );
	})
	.then( ( json ) => {

		let market = {
			platform: "ios",
			region: "na",
			language: "en",
		};

		let data;
		try {
			data = JSON.parse( json );
		} catch ( error ) {
			throw error;
		}

		let remaining = data.items.length;
		for ( let item of data.items ) {

			if ( item.category === "iap" ) {
				IapController.createStat( item, market );
			}
			else if ( item.category === "boost" ) {
				BoostController.createStat( item, market );
			}
			else if ( item.category === "hero" ) {
				HeroController.createStat( item, market );
			}
			else if ( item.category === "socialActions" ) {
				ActionController.createStat( item, market );
			}
			else if ( item.category === "bundle" ) {
				BundleController.createStat( item, market );
			}
			else if ( item.category === "skin" ) {
				SkinController.createStat( item, market );
			}
			else {
				throw new Error( "unrecognized item >> ", JSON.stringify( item ) );
			}
		}
		
	})
	.catch( ( error ) => {
		if ( ! error instanceof PromiseEndError )
			throw error;
		console.log( error );
	});