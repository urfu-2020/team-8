import React from 'react';
import './Message.css';
import Box from '@material-ui/core/Box';

class Message extends React.Component {
    render() {
      let textMessege = <Box>{this.props.message.text}</Box>;
      let timeMessege = <Box className="timeMessage">{this.props.message.time}</Box>;
      if (this.props.message.isMy) {
        return (
          <Box className="myMessage">
            {timeMessege}
            {textMessege}
          </Box>
        )
      }
      else {
        return (
          <Box className="message">
            {textMessege}
            {timeMessege}
          </Box>
        )
      }
    }
  }

  export default Message