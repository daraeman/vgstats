const Feed = require( "../model/Feed" );
const fs = require( "fs.promised" );
const request = require( "request-promise-native" );

const feed_interval = 20; // minutes

function createSavePath( path ) {
	return  __dirname + "/../" + path + "/" + +new Date() + ".json";
}

const retrieveFeed = function( feed ) {
	return new Promise( ( resolve, reject ) => {

		let json;
		request( feed.url )
			.then( ( body ) => {
				json = body;
				return fs.writeFile( createSavePath( feed.path ), body );
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
		date: { $lt: cutoff_date },
	});
};

const getFeedToFetchAll = function( type ) {
	let cutoff_date = new Date();
		cutoff_date.setMinutes( cutoff_date.getMinutes() - feed_interval );
	return Feed.find( {
		type: type,
		date: { $lt: cutoff_date },
	});
};

const getAll = function() {
	return Feed.find( {} );
};

const add = function( url, language, region, platform, type, interval, enabled, path ) {
	return new Promise( ( resolve, reject ) => {
		Feed.findOne({ url: url })
			.then( ( feed ) => {

				if ( feed )
					return resolve( feed );

				Feed.create({
						url: url,
						language: language,
						region: region,
						platform: platform,
						type: type,
						interval: interval,
						enabled: enabled,
						path: path,
					})
					.then( ( feed ) => {
						if ( feed )
							return resolve( feed );
						else
							return reject( "Failed to create Feed" );
					});

			})
			.catch( ( error ) => {
				return reject( error );
			});
	});
};

const update = function( url, language, region, platform, type, interval, enabled, path ) {
	return new Promise( ( resolve, reject ) => {
		Feed.findOne({ url: url })
			.then( ( feed ) => {

				if ( ! feed )
					return reject( "Failed to find feed" );

				feed.interval = interval;
				if ( language )
					feed.language = language;
				if ( region )
					feed.region = region;
				if ( platform )
					feed.platform = platform;
				if ( type )
					feed.type = type;
				if ( interval )
					feed.interval = interval;
				if ( path )
					feed.path = path;
				if ( typeof enabled !== "undefined" )
					feed.interval = interval;
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