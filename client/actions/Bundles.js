import axios from "axios"

export function fetchBundles( dispatch ) {

	dispatch({ type: "FETCH_BUNDLES_PENDING" })
	return function ( dispatch ) {

		axios( process.env.REACT_APP_BACKEND_URL + "/api/bundles/get", { method: "post", withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_BUNDLES_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_BUNDLES_REJECTED", payload: error })
			});

	}
}
