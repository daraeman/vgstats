process.env.BASE = process.cwd();
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
	console.log( msg )
	//logStream.write( "["+ new Date() +"] " + msg + "\n" );
}
const heroes_view = require( "../controller/HeroesView" );
const hero_view = require( "../controller/HeroView" );

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
app.use( "/img", express.static( process.env.BASE + "/server/public/img" ) );
app.use( "/font", express.static( process.env.BASE + "/server/public/font" ) );
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
app.get( "/api/heroes/get", jsonParser, heroes_view.heroes_list );
//app.get( "/api/hero/get", jsonParser, hero_view.hero_data );

if ( process.env.NODE_ENV == "production" ) {
	app.get( "/bundle.js", ( request, response ) => {
		response.sendFile( process.env.BASE + "/client/build/bundle.js" );
	});
	app.get( "/*", ( request, response ) => {
		response.sendFile( process.env.BASE + "/client/build/index.html" );
	});
}
else {
	app.get( "/", ( request, response ) => {
		response.redirect( 301, process.env.FRONTEND_URL + request.originalUrl );
	});
}

db.connect()
	.then( () => {
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

