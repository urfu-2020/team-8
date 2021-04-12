import React from 'react';
import './Message.css';
import Box from '@material-ui/core/Box';

function Message({message}) {
  let textMessege = <Box>{message.text}</Box>;
  let timeMessege = <Box className="timeMessage" ml={2} mr={2}>{message.time}</Box>;
  if (message.isMy) {
    return (
      <Box className="myMessage" m={0.7} p={1.2}>
        {timeMessege}
        {textMessege}
      </Box>
    )
  }
  else {
    return (
      <Box className="message" m={0.7} p={1.2}>
        {textMessege}
        {timeMessege}
      </Box>
    )
  }
}

export default Message