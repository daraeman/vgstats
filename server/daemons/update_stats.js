const fs = require( "fs.promised" );
const db = require( "../controller/db" );
const Action = require( "../model/Action" );
const Boost = require( "../model/Boost" );
const Bundle = require( "../model/Bundle" );
const Hero = require( "../model/Hero" );
const Iap = require( "../model/Iap" );
const IapStat = require( "../model/IapStat" );
const ImageController = require( "../controller/Image" );
const Skin = require( "../model/Skin" );
const Stat = require( "../model/Stat" );

const path = __dirname + "/../data/marketfeed/na/en/1508905823.json";

db.connect()
	.then( () => {
		fs.readFile( path )
			.then( ( json ) => {
				let data = JSON.parse( json );
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