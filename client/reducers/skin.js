export default function reducer(
	state = {
		skin: {
			skin: {},
			stats: [],
		},
		fetching: false,
		fetched: false,
		error: null,
	},
	action
) {
	switch ( action.type ) {
		case "FETCH_SKIN_PENDING": {
			return { ...state, fetching: true }
		}
		case "FETCH_SKIN_REJECTED": {
			return { ...state, fetching: false, error: action.payload }
		}
		case "FETCH_SKIN_FULFILLED": {
			console.log( "action", action )
			return { ...state, fetching: false, fetched: true, skin: action.payload }
		}
	}

	return state
}