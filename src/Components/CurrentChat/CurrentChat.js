import React from 'react';
import './CurrentChat.css';
import { Box, Paper, Grid } from '@material-ui/core';
import SendingMessage from './../../Components/SendingMessage/SendingMessage';
import Message from './../../Components/Message/Message';

function CurrentChat({messages, onClick, message, handleWriteMessage}) {
  return (
    <Grid item xs={8}>
      <Paper className="current-contact">
        <Box className="current-contact__messages"> 
          {messages.map(element => <Message key={element.id} message={element}/>)}
        </Box>
        <SendingMessage message={message} onClick={()=>onClick()} handleWriteMessage={handleWriteMessage}/>
      </Paper>
    </Grid>
  )
}

export default CurrentChat