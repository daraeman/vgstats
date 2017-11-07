import axios from "axios"

export function fetchBoosts( dispatch ) {

	dispatch({ type: "FETCH_BOOSTS_PENDING" })
	return function ( dispatch ) {

		axios( process.env.REACT_APP_BACKEND_URL + "/api/boosts/get", { method: "post", withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_BOOSTS_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_BOOSTS_REJECTED", payload: error })
			});

	}
}
