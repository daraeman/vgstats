import axios from "axios"

export function fetchBoost( dispatch, name ) {

	dispatch({ type: "FETCH_BOOST_PENDING" })
	return function ( dispatch ) {
		axios( process.env.REACT_APP_BACKEND_URL + "/api/boost/get", { method: "post", data: { name: name }, withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_BOOST_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_BOOST_REJECTED", payload: error })
			});

	}
}
