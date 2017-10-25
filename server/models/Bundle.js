const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BundleSchema = new Schema({
	symbol: { type: String },
});

module.exports = mongoose.model( "Bundle", BundleSchema );