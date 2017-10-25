const fs = require( "fs.promised" );
const db = require( "../controller/db" );
const Action = require( "../model/Action" );
const Boost = require( "../model/Boost" );
const Bundle = require( "../model/Bundle" );
const Hero = require( "../model/Hero" );
const Iap = require( "../model/Iap" );
const IapStat = require( "../model/IapStat" );
const Image = require( "../model/Image" );
const Skin = require( "../model/Skin" );
const Stat = require( "../model/Stat" );

const path = __dirname + "/../data/marketfeed/na/en/1508905823.json";

fs.readFile( path )
	.then( ( json ) => {
		let data = JSON.parse( json );
		data.items.forEach( ( item ) => {
			
		});
	});