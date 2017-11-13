const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const SkinSchema = new Schema({
	symbol: { type: String },
	hero: { type: ObjectId },
});

module.exports = mongoose.model( "Skin", SkinSchema );