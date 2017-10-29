export default function reducer(
	state = {
		heroes: [
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
		case "FETCH_HEROES_PENDING": {
			return { ...state, fetching: true }
		}
		case "FETCH_HEROES_REJECTED": {
			return { ...state, fetching: false, error: action.payload }
		}
		case "FETCH_HEROES_FULFILLED": {
			console.log( "action", action )
			return { ...state, fetching: false, fetched: true, heroes: action.payload }
		}
	}

	return state
}