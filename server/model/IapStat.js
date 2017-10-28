const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const IapStatSchema = new Schema({
	IapId: { type: ObjectId },
	date: { type: Date },
	amount: { type: Number },
	image: { type: ObjectId },
	enabled: { type: Boolean },
	USD: { type: Number },
	CNY: { type: Number },
	feed: { type: ObjectId },
});

module.exports = mongoose.model( "IapStat", IapStatSchema );