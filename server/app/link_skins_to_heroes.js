const db = require( "../controller/db" );
const skin_controller = require( "../controller/Skin" );
const Skin = require( "../model/Skin" );
const PromiseEndError = require( "../controller/PromiseEndError" );

function log( msg ) {
	console.log( msg );
}

db.connect()
	.then( () => {
		return Skin.find({ hero: { $eq: null } });                                                                                                      
	})
	.then( ( skins ) => {

		if ( ! skins )
			throw new PromiseEndError( "No Skins Needing Linking Found." );

		log( "Linking "+ skins.length +" skins" );

		let jobs = [];
		skins.forEach( ( skin ) => {
			jobs.push( skin_controller.linkSkinToHero( skin ) );
		});

		return Promise.all( jobs );
	})
	.then( ( error ) => {
		log( "Done" );
		db.close();                                                                                                    
	})
	.catch( ( error ) => {
		log( error );
		db.close();
	});
