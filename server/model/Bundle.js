const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const BundleSchema = new Schema({
	symbol: { type: String },
});

module.exports = mongoose.model( "Bundle", BundleSchema );