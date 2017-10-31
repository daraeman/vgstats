import axios from "axios"

/*
{
	type: "FETCH_SKINS_FULFILLED",
	payload: [{
		name: String,
	}]
}
*/
export function fetchSkins( dispatch ) {

	dispatch({ type: "FETCH_SKINS_PENDING" })
	return function ( dispatch ) {

		axios( process.env.REACT_APP_BACKEND_URL + "/api/skins/get", { method: "post", withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_SKINS_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_SKINS_REJECTED", payload: error })
			});

	}
}
