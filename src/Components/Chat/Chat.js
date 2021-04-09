import React from 'react';
import avatar from './../../static/avatar.jpg';
import './Chat.css';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button, Avatar } from '@material-ui/core';

class Chat extends React.Component {
    render() {
      return (
        <Button variant="outlined" className="chat" onClick={() => this.props.onClick(this.props.name)}>
          <Avatar alt="Remy Sharp" src={avatar}/>
          <Box className="infoChat">
            <Typography>
              {this.props.name}
            </Typography>
            <Typography>
              {this.props.text}
            </Typography>
          </Box>
          <Typography className="timeLastMessage">
            {this.props.time}
          </Typography>
        </Button>
      )
    }
  }
export default Chat