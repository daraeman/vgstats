export default function reducer(
	state = {
		action: {
			action: {},
			stats: [],
		},
		fetching: false,
		fetched: false,
		error: null,
	},
	action
) {
	switch ( action.type ) {
		case "FETCH_ACTION_PENDING": {
			return { ...state, fetching: true }
		}
		case "FETCH_ACTION_REJECTED": {
			return { ...state, fetching: false, error: action.payload }
		}
		case "FETCH_ACTION_FULFILLED": {
			console.log( "action", action )
			return { ...state, fetching: false, fetched: true, action: action.payload }
		}
	}

	return state
}