import React, { useContext } from "react"
import { Redirect } from "react-router-dom"
import { AuthContext } from "../App"
import Messenger from "./Messenger/Messenger"
import {getElapsedTime} from "../utils/date.utils"


export default function Home() {
	const { state, dispatch } = useContext(AuthContext)

	if (!state.user) {
		return <Redirect to="/login" />
	}

	if (state.tokenСreationTime && getElapsedTime(state.tokenСreationTime) >= state.user["lifetime"] ) {
		dispatch({
			type: "LOGOUT"
		})
	}

	const handleLogout = () => {
		dispatch({
			type: "LOGOUT"
		})
		fetch("http://localhost:5000/logout", {
			method: "POST",
			body: JSON.stringify(state.user)
		})
	}

	return (
		<Messenger avatar={state.user["avatar_url"]} login={state.user["login"]} handleLogout={()=> handleLogout()}/>
	)

}
