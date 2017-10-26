const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
	sha256: { type: String },
	url: { type: String },
	fetched: { type: Date, default: null },
	error: { type: String, default: null },
	previous: { type: Array },
});

module.exports = mongoose.model( "Video", VideoSchema );