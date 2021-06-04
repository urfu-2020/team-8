import React, { useState, useEffect, useContext } from "react"
import { Redirect } from "react-router-dom"
import GithubIcon from "mdi-react/GithubIcon"
import { AuthContext } from "../../App"
import "./Login.css"
import { ThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import themeDark from "../../themeDark"


export default function Login() {

	const { state, dispatch } = useContext(AuthContext)
	const [data, setData] = useState({ errorMessage: "", isLoading: false })

	const { client_id, redirect_uri } = state
  
	useEffect(() => {
		// After requesting Github access, Github redirects back to your app with a code parameter
		const url = window.location.href
		const hasCode = url.includes("?code=")

		// If Github API returns the code parameter
		if (hasCode) {
			const newUrl = url.split("?code=")
			window.history.pushState({}, null, newUrl[0])
			setData({ ...data, isLoading: true })

			const requestData = {
				code: newUrl[1]
			}

			const proxy_url = state.proxy_url
			// Use code parameter and other parameters to make POST request to proxy_server
			fetch(proxy_url, {
				method: "POST",
				body: JSON.stringify(requestData)
			})
				.then(response => response.json())
				.then(data => {
					dispatch({
						type: "LOGIN",
						payload: { user: data, tokenСreationTime: new Date() }
					})
				})
				.catch(_ => {
					setData({
						isLoading: false,
						errorMessage: "Sorry! Login failed"
					})
				})
		}
	}, [state, dispatch, data])

	if (state.user) {
		return <Redirect to="/" />
	}

	return (
		<ThemeProvider theme={themeDark}>
			<CssBaseline />
			<section className="container">
				<div>
					<h1 className="name-app">Killogram</h1>
					<span>{data.errorMessage}</span>
					<div className="login-container">
						{data.isLoading ? (
							<div className="loader-container">
								<div className="loader"></div>
							</div>
						) : (
							<a
								className="login-link"
								href={`https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${redirect_uri}`}
								onClick={() => {
									setData({ ...data, errorMessage: "" })
								}}
							>
								<GithubIcon />
								<span>Login with GitHub</span>
							</a>
						)}
					</div>
				</div>
			</section>
		</ThemeProvider>
	)
}