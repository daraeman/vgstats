import { combineReducers } from "redux"

import heroes from "./heroes"
import hero from "./hero"

export default combineReducers({
	heroes,
	hero,
})