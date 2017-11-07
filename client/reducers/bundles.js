export default function reducer(
	state = {
		bundles: [
			{
				name: "",		
			}
		],
		fetching: false,
		fetched: false,
		error: null,
	},
	action
) {
	switch ( action.type ) {
		case "FETCH_BUNDLES_PENDING": {
			return { ...state, fetching: true }
		}
		case "FETCH_BUNDLES_REJECTED": {
			return { ...state, fetching: false, error: action.payload }
		}
		case "FETCH_BUNDLES_FULFILLED": {
			console.log( "action", action )
			return { ...state, fetching: false, fetched: true, bundles: action.payload }
		}
	}

	return state
}