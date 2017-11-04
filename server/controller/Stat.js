const Stat = require( "../model/Stat" );

const getAllStatsLatest = function( feed ) {
	return Stat.aggregate([
		{ $match: { feed: feed._id } },
		{ $sort: { date: -1 } },
		{ $group: {
			_id: "$id",
			last_date: { $first: "$date" },
			missing: { $first: "$missing" }
		}},
	]);
}

module.exports = {
	getAllStatsLatest: getAllStatsLatest,
};