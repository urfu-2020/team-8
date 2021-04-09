import React from 'react';
import './CurrentChat.css';
import { Box, Paper, Grid } from '@material-ui/core';
import SendingMessage from './../../Components/SendingMessage/SendingMessage';
import Message from './../../Components/Message/Message';


class CurrentChat extends React.Component {
    renderMessage(i) {
      if (i < this.props.messages.length)
        return <Message message={this.props.messages[i]}/>
      return null
    }
  
    render() {
      return (
        <Grid item xs={8}>
          <Paper className="currentChat">
            <Box className="messages">
              {this.renderMessage(0)}
              {this.renderMessage(1)}
              {this.renderMessage(2)}
              {this.renderMessage(3)}  
              {this.renderMessage(4)}
              {this.renderMessage(5)}
              {this.renderMessage(6)}
              {this.renderMessage(7)}
              {this.renderMessage(8)}
              {this.renderMessage(9)}    
            </Box>
            <SendingMessage onClick={()=>this.props.onClick()}/>
          </Paper>
        </Grid>
      )
    }
  }

export default CurrentChat