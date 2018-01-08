const db = require( "../controller/db" );
const PromiseEndError = require( "../controller/PromiseEndError" );
const ImageController = require( "../controller/Image" );
require( "dotenv" ).config();
const Queue = require( "simple-promise-queue" );
let queue = new Queue({
	autoStart: true,
	concurrency: 1,
});
const Utils = require( __dirname + "/../controller/Utils" );
const log = require( "../controller/Log" )( require( "path" ).resolve( __dirname, "../../log/fetch_images" ) );

const loop_delay = ( 1000 * 60 ); // check for images needing fetching once every minute
const request_delay = ( 1000 * 30 ); // don't hit servers more than once every 30 seconds

function callback() {

	log.info( "loop" );

	return new Promise( ( resolve, reject ) => {

		db.connect()
			.then(() => {
				return ImageController.getImagesToFetchAll();
			})
			.then( ( images ) => {

				if ( ! images || ! images.length )
					throw new PromiseEndError( "Nothing to fetch" );

				log.info( "["+ images.length +"] images found to fetch" );

				let image_jobs = [];
				images.forEach( ( image ) => {
					image_jobs.push( queue.pushTask( function( resolve ) {

						log.info( "retrieving" )

						// if our request is quicker than request_delay,
						// timeout for the difference of the time
						let start_time = +new Date();
						ImageController.retrieve( image )
							.then( ( image ) => {
								let end_time = +new Date();
								let diff = ( end_time - start_time );
								let delay = ( diff >= request_delay ) ? 0 : ( request_delay - diff );
								setTimeout( () => {
									resolve();
								}, delay );
							})
							.catch( ( error ) => {
								let end_time = +new Date();
								let diff = ( end_time - start_time );
								let delay = ( diff >= request_delay ) ? 0 : ( request_delay - diff );
								log.error( error );
								setTimeout( () => {
									resolve();
								}, delay );
							});
						
					}) );
				});

				return Promise.all( image_jobs );

			})
			.then( () => {
				db.close();
				return resolve();
			})
			.catch( ( error ) => {
				db.close();
				if ( error.name === "MongoError" || error.name === "MongooseError" ) {
					log.error( error );
					return resolve( 1000 * 5 );
				}
				else if ( error instanceof PromiseEndError ) {
					return resolve();
				}
				else {
					// we don't want the loop to die, so resolve instead of reject
					log.error( error );
					return resolve();
				}
			});
	});

}

Utils.loop( callback, loop_delay );