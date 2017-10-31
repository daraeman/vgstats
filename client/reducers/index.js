import { combineReducers } from "redux"

import heroes from "./heroes"
import hero from "./hero"
import skins from "./skins"

export default combineReducers({
	heroes,
	hero,
	skins,
})