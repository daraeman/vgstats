const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const BoostSchema = new Schema({
	title: { type: String },
	giftable: { type: Boolean },
	amount: { type: Number },
});

module.exports = mongoose.model( "Boost", BoostSchema );