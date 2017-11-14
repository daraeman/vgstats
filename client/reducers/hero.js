export default function reducer(
	state = {
		hero: {
			hero: {
				name: "",
				release_date: "",
			},
			stats: [],
			skins: [],
		},
		fetching: false,
		fetched: false,
		error: null,
	},
	action
) {
	switch ( action.type ) {
		case "FETCH_HERO_PENDING": {
			return { ...state, fetching: true }
		}
		case "FETCH_HERO_REJECTED": {
			return { ...state, fetching: false, error: action.payload }
		}
		case "FETCH_HERO_FULFILLED": {
			console.log( "action", action )
			return { ...state, fetching: false, fetched: true, hero: action.payload }
		}
	}

	return state
}