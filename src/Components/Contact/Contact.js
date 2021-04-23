import React from "react"
import avatar from "./../../static/avatar.jpg"
import "./Contact.css"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import { Button, Avatar } from "@material-ui/core"

function Contact({name, lastText, time, handleClickContact}) {
	return (
		<Button variant="outlined" className="contact" onClick={() => handleClickContact(name)}>
			<Avatar alt="Remy Sharp" src={avatar}/>
			<Box className="contact__info"m={1}>
				<Typography>
					{name}
				</Typography>
				<Typography>
					{lastText}
				</Typography>
			</Box>
			<Typography className="contact__last-message__time">
				{time}
			</Typography>
		</Button>
	)
}

export default Contact