import axios from "axios"

export function fetchIaps( dispatch ) {

	dispatch({ type: "FETCH_IAPS_PENDING" })
	return function ( dispatch ) {

		axios( process.env.REACT_APP_BACKEND_URL + "/api/iaps/get", { method: "post", withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_IAPS_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_IAPS_REJECTED", payload: error })
			});

	}
}
