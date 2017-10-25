const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BoostSchema = new Schema({
	title: { type: String },
	symbol: { type: String },
	lore: { type: String },
	video: { type: String },
	vgf: { type: String },
});

module.exports = mongoose.model( "Boost", BoostSchema );