import axios from "axios"

/*
{
	type: "FETCH_HEROES_FULFILLED",
	payload: [{
		name: String,
	}]
}
*/
export function fetchHero( dispatch, name ) {

	dispatch({ type: "FETCH_HERO_PENDING" })
	console.log( "hero action", name )
	return function ( dispatch ) {
//		dispatch({ type: "FETCH_HERO_FULFILLED", payload: [
//			{ name: name },
//		] })

		axios( process.env.REACT_APP_BACKEND_URL + "/api/hero/get", { method: "get", data: { name: name }, withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_HERO_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_HERO_REJECTED", payload: error })
			});

	}
}
