const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BoostSchema = new Schema({
	title: { type: String },
	giftable: { type: Boolean }
});

module.exports = mongoose.model( "Boost", BoostSchema );