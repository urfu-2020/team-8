import React from 'react';
import avatar from './../../static/avatar.jpg';
import './Contact.css';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, Avatar } from '@material-ui/core';

function Contact({name, lastText, time, onClick}) {
  return (
    <Button variant="outlined" className="chat" onClick={() => onClick(name)}>
        <Avatar alt="Remy Sharp" src={avatar}/>
        <Box className="infoChat"m={1}>
          <Typography>
            {name}
          </Typography>
          <Typography>
            {lastText}
          </Typography>
        </Box>
        <Typography className="timeLastMessage">
          {time}
        </Typography>
      </Button>
  )
}

export default Contact