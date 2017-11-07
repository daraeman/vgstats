export default function reducer(
	state = {
		iap: {
			iap: {},
			stats: [],
		},
		fetching: false,
		fetched: false,
		error: null,
	},
	action
) {
	switch ( action.type ) {
		case "FETCH_IAP_PENDING": {
			return { ...state, fetching: true }
		}
		case "FETCH_IAP_REJECTED": {
			return { ...state, fetching: false, error: action.payload }
		}
		case "FETCH_IAP_FULFILLED": {
			console.log( "action", action )
			return { ...state, fetching: false, fetched: true, iap: action.payload }
		}
	}

	return state
}