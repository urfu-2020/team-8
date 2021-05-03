import React from "react"
import Logo from "./../../Components/Logo/Logo"
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    title: {
      flexGrow: 1
    }
}));

function Header({handleLogout}) {
	const classes = useStyles();
	return (
		<AppBar position="static">
			<Toolbar>
				<Logo/>
				<Typography variant="h6" color="inherit" className={classes.title}>
          			Kilogram
				</Typography>
				<Button color="inherit" onClick={()=> handleLogout()}>Logout</Button>
			</Toolbar>
		</AppBar>
	)
}
export default Header