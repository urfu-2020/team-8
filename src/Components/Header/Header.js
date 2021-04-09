import React from 'react';
import logo from './../../static/logo.png';
import './Header.css';
import Box from '@material-ui/core/Box';


class Header extends React.Component {
    render() {
      return (
        <Box className="header" height={window.innerHeight * 8 / 100}>
          <img src={logo} alt="logo" />
          <Box className="nameSite">
            Kilogram
          </Box>
        </Box>
      )
    }
  }
export default Header