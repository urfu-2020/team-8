import React from 'react';
import './CurrentChat.css';
import { Box, Paper, Grid } from '@material-ui/core';
import SendingMessage from './../../Components/SendingMessage/SendingMessage';
import Message from './../../Components/Message/Message';

function CurrentChat({messages, onClick}) {
  return (
    <Grid item xs={8}>
      <Paper className="currentChat">
        <Box className="messages"> 
          {messages.map(element => <Message key={element.id} message={element}/>)}
        </Box>
        <SendingMessage onClick={()=>onClick()}/>
      </Paper>
    </Grid>
  )
}
  
export default CurrentChat