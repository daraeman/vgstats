const Feed = require( "../model/Feed" );
const fs = require( "fs.promised" );
const request = require( "request-promise-native" );
const mkdirp = require( "mkdirp-promise" );
require( "dotenv" ).config();

const feed_interval = process.env.FEED_INTERVAL;

function createSavePath( path ) {
	return  __dirname + "/../" + path;
}

const retrieveFeed = function( feed ) {
	return new Promise( ( resolve, reject ) => {

		fs.readFile( __dirname + "/../data/marketfeed/ios/na/en/1509177889513.json" )
			.then( ( json ) => {
				return resolve( json );
			});

		return;

		let json;
		request( feed.url )
			.then( ( body ) => {
				json = body;
				return fs.writeFile( createSavePath( feed.path ) + "/" + +new Date() + ".json", body );
			})
			.then( () => {
				feed.fetched = new Date();
				feed.error = false;
				return feed.save();
			})
			.then( () => {
				return resolve( json );
			})
			.catch( ( error ) => {
				feed.error = true;
				feed.fetch_errors.push( { date: new Date(), error: error } );
				feed.save();
				return reject( error );
			});
	});
};

const getFeedToFetch = function( type ) {
	let cutoff_date = new Date();
		cutoff_date.setMinutes( cutoff_date.getMinutes() - feed_interval );
	return Feed.findOne( {
		type: type,
		fetched: { $lt: cutoff_date },
	});
};

const getFeedToFetchAll = function( type ) {
	let cutoff_date = new Date();
		cutoff_date.setMinutes( cutoff_date.getMinutes() - feed_interval );
	return Feed.find( {
		type: type,
		fetched: { $lt: cutoff_date },
	});
};

const getAll = function() {
	return Feed.find( {} );
};

const add = function( url, language, region, platform, type, enabled, path ) {
	return new Promise( ( resolve, reject ) => {
		Feed.findOne({ url: url })
			.then( ( feed ) => {

				if ( feed )
					return resolve( feed );

				let this_feed;
				Feed.create({
						url: url,
						language: language,
						region: region,
						platform: platform,
						type: type,
						enabled: enabled,
						path: path,
					})
					.then( ( feed ) => {
						if ( ! feed )
							throw new Error( "Failed to create Feed" );
						this_feed = feed;
						return mkdirp( createSavePath( path ) );
					})
					.then( () => {
						return resolve( this_feed );
					});

			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const update = function( url, language, region, platform, type, enabled, path ) {
	return new Promise( ( resolve, reject ) => {
		Feed.findOne({ url: url })
			.then( ( feed ) => {

				if ( ! feed )
					return reject( "Failed to find feed" );

				if ( language )
					feed.language = language;
				if ( region )
					feed.region = region;
				if ( platform )
					feed.platform = platform;
				if ( type )
					feed.type = type;
				if ( path )
					feed.path = path;
				feed.save()
					.then( ( feed ) => {
						return resolve( feed );
					});
			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const remove = function( url ) {
	return new Promise( ( resolve, reject ) => {
		Feed.findOne({ url: url })
			.then( ( feed ) => {

				if ( ! feed )
					return reject( "Failed to find feed" );

				feed.remove()
					.then( () => {
						return resolve();
					});

			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const disable = function( url ) {
	return new Promise( ( resolve, reject ) => {
		Feed.findOne({ url: url })
			.then( ( feed ) => {

				if ( ! feed )
					return reject( "Failed to find feed" );

				feed.enabled = 0;
				feed.save()
					.then( () => {
						return resolve();
					});

			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const enable = function( url ) {
	return new Promise( ( resolve, reject ) => {
		Feed.findOne({ url: url })
			.then( ( feed ) => {

				if ( ! feed )
					return reject( "Failed to find feed" );

				feed.enabled = 1;
				feed.save()
					.then( () => {
						return resolve();
					});

			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

module.exports = {
	retrieveFeed: retrieveFeed,
	getFeedToFetch: getFeedToFetch,
	getFeedToFetchAll: getFeedToFetchAll,
	getAll: getAll,
	add: add,
	update: update,
	remove: remove,
	disable: disable,
	enable: enable,
};