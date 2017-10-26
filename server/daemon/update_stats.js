const fs = require( "fs.promised" );
const db = require( __dirname + "/../controller/db" );
const ActionController = require( __dirname + "/../controller/Action" );
const BoostController = require( __dirname + "/../controller/Boost" );
const BundleController = require( __dirname + "/../controller/Bundle" );
const HeroController = require( __dirname + "/../controller/Hero" );
const IapController = require( __dirname + "/../controller/Iap" );
const SkinController = require( __dirname + "/../controller/Skin" );
require( "dotenv" ).config( __dirname + "/../../.env" );

const path = __dirname + "/../data/marketfeed/na/en/1508905823.json";

db.connect()
	.then( () => {
		fs.readFile( path )
			.then( ( json ) => {
				let data = JSON.parse( json );
				let remaining = data.items.length;
				for ( let item of data.items ) {
					if ( item.category === "iap" )
						IapController.createStat( item );
					else if ( item.category === "boost" )
						BoostController.createStat( item );
					else if ( item.category === "hero" )
						HeroController.createStat( item );
					else if ( item.category === "socialActions" )
						ActionController.createStat( item );
					else if ( item.category === "bundle" )
						BundleController.createStat( item );
					else if ( item.category === "skin" )
						SkinController.createStat( item );
					else
						throw new Error( "unrecognized item >> ", JSON.stringify( item ) );
				}
			});
	});