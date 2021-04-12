import React from 'react';
import logo from './../../static/logo.png';
import './Header.css';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <img src={logo}/>
        <Typography variant="h6"  color="inherit">
          Kilogram
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
export default Header