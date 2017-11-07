import { combineReducers } from "redux"

import heroes from "./heroes"
import hero from "./hero"
import skins from "./skins"
import skin from "./skin"
import bundles from "./bundles"
import bundle from "./bundle"
import iaps from "./iaps"
import iap from "./iap"
import actions from "./actions"
import action from "./action"
import boosts from "./boosts"
import boost from "./boost"


export default combineReducers({
	heroes,
	hero,
	skins,
	skin,
	bundles,
	bundle,
	iaps,
	iap,
	actions,
	action,
	boosts,
	boost,
})