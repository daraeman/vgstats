import axios from "axios"

export function fetchBundle( dispatch, name ) {

	dispatch({ type: "FETCH_BUNDLE_PENDING" })
	return function ( dispatch ) {
		axios( process.env.REACT_APP_BACKEND_URL + "/api/bundle/get", { method: "post", data: { name: name }, withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_BUNDLE_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_BUNDLE_REJECTED", payload: error })
			});

	}
}
