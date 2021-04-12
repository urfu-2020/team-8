import React from 'react';
import './SendingMessage.css';
import Box from '@material-ui/core/Box';
import { Button, TextField } from '@material-ui/core';


function SendingMessage ({onClick}) { 
    if (document.getElementById('writeMessaage'))
      document.getElementById('writeMessaage').value = ""

    return (
      <Box className="sendWriteMessage">
        <TextField id="writeMessaage" autoComplete='off' className="writeMessaagelabel" label="Написать сообщение"/>
        <Button variant="contained" onClick={()=>onClick()}>Отправить</Button>
      </Box>
    )
    
  }

export default SendingMessage