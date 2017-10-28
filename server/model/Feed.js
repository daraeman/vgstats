const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
	url: { type: String },
	language: { type: String },
	region: { type: String },
	platform: { type: String },
	type: { type: String },
	fetched: { type: Date, default: new Date(0) },
	enabled: { type: Boolean },
	path: { type: String }, // for saving the raw json files
	error: { type: Boolean, default: false },
	fetch_errors: { type: Array, default: [] },
	change_id: { type: String, default: "" }, // this is currently a timestamp, but leaving it as a String in case theit format changes and we need to rely on a hash
});

module.exports = mongoose.model( "Feed", FeedSchema );