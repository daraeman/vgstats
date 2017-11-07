export default function reducer(
	state = {
		boost: {
			boost: {},
			stats: [],
		},
		fetching: false,
		fetched: false,
		error: null,
	},
	action
) {
	switch ( action.type ) {
		case "FETCH_BOOST_PENDING": {
			return { ...state, fetching: true }
		}
		case "FETCH_BOOST_REJECTED": {
			return { ...state, fetching: false, error: action.payload }
		}
		case "FETCH_BOOST_FULFILLED": {
			console.log( "action", action )
			return { ...state, fetching: false, fetched: true, boost: action.payload }
		}
	}

	return state
}