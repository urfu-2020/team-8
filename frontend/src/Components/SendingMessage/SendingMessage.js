import React from "react"
import "./SendingMessage.css"
import Box from "@material-ui/core/Box"
import { Button, TextField } from "@material-ui/core"


function SendingMessage ({onClick, handleWriteMessage, message, shouldChangeMessage, onClickTimerDelete, isTurnOnTimerDelete, onClickTimerSend, isTurnOnTimerSend}) {
	return (
		<Box className="send-form">
			<TextField 
				id="writeMessaage" 
				autoComplete='off' 
				className="write-message__text-field" 
				label="Написать сообщение" 
				value={message} 
				onChange={handleWriteMessage}/>
			{isTurnOnTimerSend
				? <Button variant="contained" onClick={()=>onClickTimerSend()}>Выкл "отправить через"</Button>
				: <Button variant="contained" onClick={()=>onClickTimerSend()}>Вкл "отправить через"</Button>
			}
			{isTurnOnTimerDelete
				? <Button variant="contained" onClick={()=>onClickTimerDelete()}>Выкл "удалить через"</Button>
				: <Button variant="contained" onClick={()=>onClickTimerDelete()}>Вкл "удалить через"</Button>
			}
			{shouldChangeMessage
				? <Button variant="contained" onClick={()=>onClick()}>Изменить</Button>
				: <Button variant="contained" onClick={()=>onClick()}>Отправить</Button>
			}
			
		</Box>
	)
}

export default SendingMessage