import React from 'react';
import './SendingMessage.css';
import Box from '@material-ui/core/Box';
import { Button, TextField } from '@material-ui/core';


function SendingMessage ({onClick, handleWriteMessage, message}) {
  return (
    <Box className="send-form">
      <TextField 
        id="writeMessaage" 
        autoComplete='off' 
        className="write-message-label" 
        label="Написать сообщение" 
        value={message} 
        onChange={handleWriteMessage}/>
      <Button variant="contained" onClick={()=>onClick()}>Отправить</Button>
    </Box>
  )
}

export default SendingMessage