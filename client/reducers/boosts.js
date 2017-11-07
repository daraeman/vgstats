export default function reducer(
	state = {
		boosts: [
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
		case "FETCH_BOOSTS_PENDING": {
			return { ...state, fetching: true }
		}
		case "FETCH_BOOSTS_REJECTED": {
			return { ...state, fetching: false, error: action.payload }
		}
		case "FETCH_BOOSTS_FULFILLED": {
			console.log( "action", action )
			return { ...state, fetching: false, fetched: true, boosts: action.payload }
		}
	}

	return state
}