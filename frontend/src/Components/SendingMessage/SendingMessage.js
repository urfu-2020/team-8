import React from "react"
import "./SendingMessage.css"
import Box from "@material-ui/core/Box"
import { Button, TextField } from "@material-ui/core"


function SendingMessage ({onClick, handleWriteMessage, message, shouldChangeMessage}) {
	return (
		<Box className="send-form">
			<TextField 
				id="writeMessaage" 
				autoComplete='off' 
				className="write-message__text-field" 
				label="Написать сообщение" 
				value={message} 
				onChange={handleWriteMessage}/>
			{shouldChangeMessage
				? <Button variant="contained" onClick={()=>onClick()}>Изменить</Button>
				: <Button variant="contained" onClick={()=>onClick()}>Отправить</Button>
			}
			
		</Box>
	)
}

export default SendingMessage