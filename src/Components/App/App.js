import React from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { Paper, Grid, TextField, AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import Header from './../../Components/Header/Header';
import CurrentChat from './../../Components/CurrentChat/CurrentChat';
import Contact from '../Contact/Contact';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


class DB {
  constructor() {
    this.messages = {
      "Имя": [
        {id: "1", text: "cmsdkl", isMy: false, time: "14.00"}, 
        {id: "2", text: "ojedsvmk", isMy: true, time: "14.10"}, 
        {id: "3", text: "vdklmmm.kmjkf", isMy: false, time: "14.30"}
      ],
      "Имя2": [
        {id: "4", text: "Привет", isMy: true, time: "14.00"}, 
        {id: "5", text: "Как ты?", isMy: true, time: "14.00"}, 
        {id: "6", text: "Привет", isMy: false, time: "14.10"}, 
        {id: "7", text: "норм", isMy: false, time: "14.10"}, 
      ],
      "Имя3": [
        {id: "8", text: "Привет", isMy: true, time: "14.10"}, 
      ]
    }
  }
  getMessages(name="Имя") {
    return this.messages[name]
  }

  addMessage(name="Имя", text_mes="", isMy_mes=false, time_mes="") {
    if (text_mes != "")
      this.messages[name].push({text: text_mes, isMy: isMy_mes, time: time_mes})
  }

  getNames() {
    return Object.keys(this.messages)
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.db = new DB()
    let names = this.db.getNames();
    this.state = {
      names: names,
      messages: this.db.getMessages(names[0]),
      name: names[0]
    }
  }  

  getTextMessage() {
    const time = new Date()
    this.db.addMessage(this.state.name, document.getElementById('writeMessaage').value, true, time.getHours() + "." + time.getMinutes())
    const messages = this.db.getMessages(this.state.name)
    this.setState({messages: messages});
    document.getElementById('writeMessaage').value = ""
  }

  handleClick(name) {
    const messages = this.db.getMessages(name)
    this.setState({name: name, messages: messages});
  }

  render() {
    return (
      <Container maxWidth={false} className="App">
        <Header/>
        <Paper>
          <Paper className="searchAndDataCurrentContact">    
            <Grid item xs={4}>
              <TextField id="search" className="searchLabel" label="Поиск" />
            </Grid>
            <Grid item xs={8}>
              <Box className="dataCurrentContact" ml={1} p={2.5}>
                <Box className="currentContacttName">
                  {this.state.name}
                </Box>
                <Box className="currentContactLastEnter">
                  был(а) в сети в 12.30
                </Box>
              </Box>
            </Grid>
          </Paper>
          <Box height="65vh">
            <Grid item xs={12} className="chats"> 
                <Grid item xs={4}>        
                {
                  this.state.names.map(name => {
                  const messages = this.db.getMessages(name)
                  const lastMessage = messages[messages.length - 1]
                  return <Contact key={name} name={name} lastText={lastMessage.text} time={lastMessage.time} onClick={() => this.handleClick(name)}/>
                  })
                }
                </Grid>  
              <CurrentChat name={this.state.name} messages={this.state.messages} db={this.db} onClick={()=>this.getTextMessage()}/>
            </Grid>
          </Box>
        </Paper>
      </Container>
    );
  }
}

export default App;