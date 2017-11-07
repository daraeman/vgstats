import axios from "axios"

export function fetchActions( dispatch ) {

	dispatch({ type: "FETCH_ACTIONS_PENDING" })
	return function ( dispatch ) {

		axios( process.env.REACT_APP_BACKEND_URL + "/api/actions/get", { method: "post", withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_ACTIONS_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_ACTIONS_REJECTED", payload: error })
			});

	}
}
