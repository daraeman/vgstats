const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ImageSchema = new Schema({
	name: { type: String },
	md5: { type: String },
	url: { type: String },
	fetched: { type: Date, default: null },
	error: { type: String, default: null }
});

module.exports = mongoose.model( "Image", ImageSchema );