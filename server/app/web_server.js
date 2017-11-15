const express = require( "express" );
const app = express();
//const session = require( "express-session" );
const cors = require( "cors" );
const db = require( "../controller/db" );
const bodyParser = require( "body-parser" );
const jsonParser = bodyParser.json();
require( "dotenv" ).config();
const log_path = __dirname + "/../../log/web_server";
const Utils = require( "../controller/Utils" );
const logStream = Utils.openLog( log_path );
function log( msg ) {
	logStream.write( "["+ new Date() +"] " + msg + "\n" );
}
const path = require( "path" );
const hero_view = require( "../controller/HeroView" );
const skin_view = require( "../controller/SkinView" );
const bundle_view = require( "../controller/BundleView" );
const iap_view = require( "../controller/IapView" );
const action_view = require( "../controller/ActionView" );
const boost_view = require( "../controller/BoostView" );

process.on( "uncaughtException", ( error ) => {
    log( error.stack );
});

log ( "--------------------------------------" );

app.use( cors( {
	origin: true,
	credentials: true,
}) );

app.disable( "x-powered-by" );
/*
app.use( "/img", express.static( path.resolve( __dirname + "./public/img" ) );
app.use( "/font", express.static( path.resolve( __dirname + "./public/font" ) );
*/
/*
const MongoDBStore = require( "connect-mongodb-session" )( session );

const store = new MongoDBStore({
	uri: db.getUrl( true ),
	collection: "sessions",
});

store.on( "error", ( error ) => {
	log( error );
});

app.use( session({
	secret: process.env.APP_SECRET,
	cookie: {
		maxAge: ( 1000 * 60 * 60 * 1 ) // 1 hour 
	},
	store: store,
	resave: true,
	saveUninitialized: true
}));
*/
// routes
app.post( "/api/heroes/get", hero_view.heroes_list );
app.post( "/api/hero/get", jsonParser, hero_view.hero_data );
app.post( "/api/skins/get", skin_view.skins_list );
app.post( "/api/skin/get", jsonParser, skin_view.skin_data );
app.post( "/api/bundles/get", bundle_view.bundles_list );
app.post( "/api/bundle/get", jsonParser, bundle_view.bundle_data );
app.post( "/api/iaps/get", iap_view.iaps_list );
app.post( "/api/iap/get", jsonParser, iap_view.iap_data );
app.post( "/api/actions/get", action_view.actions_list );
app.post( "/api/action/get", jsonParser, action_view.action_data );
app.post( "/api/boosts/get", boost_view.boosts_list );
app.post( "/api/boost/get", jsonParser, boost_view.boost_data );

if ( process.env.NODE_ENV == "production" ) {
	app.get( "/bundle.js", ( request, response ) => {
		response.sendFile( path.resolve( __dirname +"/../../client/build/bundle.js" ) );
	});
	app.get( "/*", ( request, response ) => {
		response.sendFile( path.resolve( __dirname +"/../../client/build/index.html" ) );
	});
}
else {
	app.get( "/", ( request, response ) => {
		response.redirect( 301, process.env.FRONTEND_URL + request.originalUrl );
	});
}

function startServer() {

	log( "Connecting to database" );
	db.connect()
		.catch( ( error ) => {

			if ( error.name === "MongoError" ) {
				if ( /failed to connect to server/.test( error.message ) ) {
					log( "Failed to connect to to database, retrying in 5 seconds" );
					setTimeout( () => {
						startServer();
					}, 5000 );
				}
				else {
					log( "Database Error" );
				}
			}

			throw error;                                                                                                       
		})
		.then( () => {
			log( "Successfully connected to database" );
			log( "Starting Web Server" );
			// start the server
			return app.listen( process.env.BACKEND_PORT );
		})
		.then( () => {

			log( "Server started on port "+ process.env.BACKEND_PORT );

			if ( process.env.BACKEND_PORT < 1024 ) {

				// this lets us use sudo to start the server on a privileged port,
				// then drop it down to normal permissions
				let uid = parseInt( process.env.SUDO_UID );

				if ( uid )
					process.setuid( uid );

				log( "Server's UID is now " + process.getuid() );

			}

		})
		.catch( ( error ) => {
			log( error );
			db.close();
		});
}

startServer();

