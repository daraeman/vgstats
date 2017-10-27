const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
	url: { type: String },
	language: { type: String },
	region: { type: String },
	platform: { type: String },
	last_fetched: { type: Date },
	interval: { type: Number }, // seconds
	enabled: { type: Boolean }
});

module.exports = mongoose.model( "Feed", FeedSchema );