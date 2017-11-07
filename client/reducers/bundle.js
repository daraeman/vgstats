export default function reducer(
	state = {
		bundle: {
			bundle: {},
			stats: [],
		},
		fetching: false,
		fetched: false,
		error: null,
	},
	action
) {
	switch ( action.type ) {
		case "FETCH_BUNDLE_PENDING": {
			return { ...state, fetching: true }
		}
		case "FETCH_BUNDLE_REJECTED": {
			return { ...state, fetching: false, error: action.payload }
		}
		case "FETCH_BUNDLE_FULFILLED": {
			console.log( "action", action )
			return { ...state, fetching: false, fetched: true, bundle: action.payload }
		}
	}

	return state
}