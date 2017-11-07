import axios from "axios"

export function fetchAction( dispatch, name ) {

	dispatch({ type: "FETCH_ACTION_PENDING" })
	return function ( dispatch ) {
		axios( process.env.REACT_APP_BACKEND_URL + "/api/action/get", { method: "post", data: { name: name }, withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_ACTION_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_ACTION_REJECTED", payload: error })
			});

	}
}
