import React from "react"
import Logo from "./../../Components/Logo/Logo"
import { AppBar, Toolbar, Typography } from "@material-ui/core"

function Header() {
	return (
		<AppBar position="static">
			<Toolbar>
				<Logo/>
				<Typography variant="h6"  color="inherit">
          Kilogram
				</Typography>
			</Toolbar>
		</AppBar>
	)
}
export default Header
