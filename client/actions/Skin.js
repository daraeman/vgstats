import axios from "axios"

/*
{
	type: "FETCH_SKIN_FULFILLED",
	payload: [{
		name: String,
	}]
}
*/
export function fetchSkin( dispatch, name ) {

	dispatch({ type: "FETCH_SKIN_PENDING" })
	return function ( dispatch ) {
		axios( process.env.REACT_APP_BACKEND_URL + "/api/skin/get", { method: "post", data: { name: name }, withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_SKIN_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_SKIN_REJECTED", payload: error })
			});

	}
}
