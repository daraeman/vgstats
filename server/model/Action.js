const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const ActionSchema = new Schema({
	action: { type: String },
});

module.exports = mongoose.model( "Action", ActionSchema );