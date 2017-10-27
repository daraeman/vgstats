const Feed = require( "../model/Feed" );
const fs = require( "fs.promised" );
const request = require( "request-promise-native" );

const market_feed_url = "http://gamefeeds.superevilmegacorp.net/market/current/marketfeed.iOS.na.en.json";
const market_feed_path = __dirname + "/../data/marketfeed/iOS/na/en/";

function createSavePath( filename ) {
	return save_folder + hash;
}

const retrieveFeed = function( video ) {
	return new Promise( ( resolve, reject ) => {

		request( video.url )
			.then( ( body ) => {
				let sha256 = crypto.createHash( "sha256" ).update( body ).digest( "hex" );
				video.sha256 = sha256;
				return fs.writeFile( createPath( sha256 ), body );
			})
			.then( () => {
				video.fetched = new Date();
				return video.save();
			})
			.then( () => {
				return resolve();
			})
			.catch( ( error ) => {
				video.error = JSON.stringify( error );
				video.save();
				return reject( error );
			});
	});
};

const getFeedToFetch = function() {
	return Feed.findOne( { $where: function() {
		let date = new Date();
		date.setSeconds( date.getSeconds() - this.fetch_interval );
		return this.last_fetched <= date;
	}});
};

const getAll = function() {
	return Feed.find( {} );
};

const add = function( url, language, region, platform, interval, enabled ) {
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
						interval: interval,
						enabled: enabled,
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

const update = function( url, language, region, platform, interval, enabled ) {
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
				if ( interval )
					feed.interval = interval;
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
					.then( ( feed ) => {
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
					.then( ( feed ) => {
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
					.then( ( feed ) => {
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
	getAll: getAll,
	add: add,
	update: update,
	remove: remove,
	disable: disable,
	enable: enable,
};