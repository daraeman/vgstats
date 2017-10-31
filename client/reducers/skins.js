export default function reducer(
	state = {
		skins: [
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
		case "FETCH_SKINS_PENDING": {
			return { ...state, fetching: true }
		}
		case "FETCH_SKINS_REJECTED": {
			return { ...state, fetching: false, error: action.payload }
		}
		case "FETCH_SKINS_FULFILLED": {
			console.log( "action", action )
			return { ...state, fetching: false, fetched: true, skins: action.payload }
		}
	}

	return state
}