const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ActionSchema = new Schema({
	action: { type: String },
});

module.exports = mongoose.model( "Action", ActionSchema );