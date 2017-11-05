require( "dotenv" ).config();
const debug = process.env.NODE_ENV !== "production";
const webpack = require( "webpack" );
const path = require( "path" );
const UglifyJSPlugin = require( "uglifyjs-webpack-plugin" );
const Dotenv = require( "dotenv-webpack" );

let plugins = [
	new Dotenv({
		path: ".env", 
		safe: false,
	})
];
if ( ! debug ) {
	plugins.push(
		new webpack.optimize.UglifyJsPlugin()
	);
}

module.exports = {
	node: {
		fs: "empty",
	},
	context: path.resolve( __dirname, "client" ),
	devtool: debug ? "inline-sourcemap" : false,
	entry: "./index.js",
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				query: {
					compact: true,
					presets: [ "react", "es2015", "stage-0" ],
					plugins: [ "react-html-attrs", "transform-class-properties", "transform-decorators-legacy" ],
				},
			},
			{
				test: /\.less$/,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader", options: { minimize: ! debug } },
					{ loader: "less-loader" },
				],
			},
		],
	},
	plugins: plugins,
	output: {
		path: path.resolve( __dirname, "client/build" ),
		filename: "bundle.js",
	},
	devServer: {
		contentBase: path.resolve( __dirname, "client/build" ),
		historyApiFallback: true,
		host: process.env.FRONTEND_HOST,
		port: process.env.FRONTEND_PORT,
	},
};