const Stat = require( "../model/Stat" );

const getAllStatsLatest = function( feed ) {
	return Stat.aggregate([
		{ $match: { feed: feed._id } },
		{ $sort: { date: -1 } },
		{ $group: {
			_id: "$id",
			stat: { $first: "$$CURRENT" },
		}},
	]);
}

module.exports = {
	getAllStatsLatest: getAllStatsLatest,
};