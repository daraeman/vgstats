import axios from "axios"

/*
{
	type: "FETCH_HEROES_FULFILLED",
	payload: [{
		name: String,
	}]
}
*/
export function fetchHeroes( dispatch ) {

	dispatch({ type: "FETCH_HEROES_PENDING" })
	return function ( dispatch ) {

		axios( process.env.REACT_APP_BACKEND_URL + "/api/heroes/get", { method: "get", withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_HEROES_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_HEROES_REJECTED", payload: error })
			});

	}
}
