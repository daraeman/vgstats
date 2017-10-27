const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const StatSchema = new Schema({
	id: { type: String },
	currency: { type: String },
	date: { type: Date },
	amount: { type: Number },
	giftable: { type: Boolean },
	image_id: { type: ObjectId },
	skin_id: { type: ObjectId },
	hero_id: { type: ObjectId },
	action_id: { type: ObjectId },
	boost_id: { type: ObjectId },
	bundle_id: { type: ObjectId },
	feed_id: { type: ObjectId },
});

module.exports = mongoose.model( "Stat", StatSchema );