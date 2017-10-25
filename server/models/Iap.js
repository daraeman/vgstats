const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const IapSchema = new Schema({
	type: { type: String },
	id: { type: String },
});

module.exports = mongoose.model( "Iap", IapSchema );