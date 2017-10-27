const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
	url: { type: String },
	language: { type: String },
	region: { type: String },
	platform: { type: String },
	fetched: { type: Date },
	interval: { type: Number }, // seconds
	enabled: { type: Boolean },
	path: { type: String }, // for saving the raw json files
	error: { type: Boolean, default: false },
	fetch_errors: { type: Array, default: [] },
});

module.exports = mongoose.model( "Feed", FeedSchema );