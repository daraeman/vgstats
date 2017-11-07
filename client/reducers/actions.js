export default function reducer(
	state = {
		actions: [
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
		case "FETCH_ACTIONS_PENDING": {
			return { ...state, fetching: true }
		}
		case "FETCH_ACTIONS_REJECTED": {
			return { ...state, fetching: false, error: action.payload }
		}
		case "FETCH_ACTIONS_FULFILLED": {
			console.log( "action", action )
			return { ...state, fetching: false, fetched: true, actions: action.payload }
		}
	}

	return state
}