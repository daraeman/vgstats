export default function reducer(
	state = {
		iaps: [
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
		case "FETCH_IAPS_PENDING": {
			return { ...state, fetching: true }
		}
		case "FETCH_IAPS_REJECTED": {
			return { ...state, fetching: false, error: action.payload }
		}
		case "FETCH_IAPS_FULFILLED": {
			console.log( "action", action )
			return { ...state, fetching: false, fetched: true, iaps: action.payload }
		}
	}

	return state
}