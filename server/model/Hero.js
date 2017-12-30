const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const HeroSchema = new Schema({
	title: { type: String },
	symbol: { type: String },
	lore: { type: String },
	video: { type: String },
	vgf: { type: String },
	epoch: { type: Number },
	placeholder: { type: Boolean, default: false },
	type: { type: String }, // ie: lane, jungle, roam
});

module.exports = mongoose.model( "Hero", HeroSchema );