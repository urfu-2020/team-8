import React from 'react';
import logo from './../../static/logo.png';
import './Header.css';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <img src={logo} alt="logo"/>
        <Typography variant="h6"  color="inherit">
          Kilogram
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
export default Header