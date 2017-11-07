import axios from "axios"

export function fetchIap( dispatch, name ) {

	dispatch({ type: "FETCH_IAP_PENDING" })
	return function ( dispatch ) {
		axios( process.env.REACT_APP_BACKEND_URL + "/api/iap/get", { method: "post", data: { name: name }, withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_IAP_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_IAP_REJECTED", payload: error })
			});

	}
}
