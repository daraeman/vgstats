//import axios from "axios"


/*
{
	type: "FETCH_HEROES_FULFILLED",
	payload: [{
		name: String,
	}]
}
*/
export function fetchHero( dispatch, name ) {

	dispatch({ type: "FETCH_HERO_PENDING" })
	return function ( dispatch ) {
		dispatch({ type: "FETCH_HERO_FULFILLED", payload: [
			{ name: "Adagio" },
		] })
/*
		axios( process.env.REACT_APP_BACKEND_URL + "/api/users/list", { method: "post", data: { search: search, amount: amount, page: page }, withCredentials: true } )
			.then( ( response ) => {
				dispatch({ type: "FETCH_HEROES_FULFILLED", payload: response.data })
			})
			.catch( ( error ) => {
				console.log( "error", error )
				dispatch({ type: "FETCH_HEROES_REJECTED", payload: { message: error.response.data, status: error.response.status } })
			});
*/
	}
}
