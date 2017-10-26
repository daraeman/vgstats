const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const HeroSchema = new Schema({
	title: { type: String },
	symbol: { type: String },
	lore: { type: String },
	video: { type: String },
	vgf: { type: String },
});

module.exports = mongoose.model( "Hero", HeroSchema );