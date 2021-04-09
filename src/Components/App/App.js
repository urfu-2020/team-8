import React from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { Paper, Grid, TextField } from '@material-ui/core';
import Header from './../../Components/Header/Header';
import CurrentChat from './../../Components/CurrentChat/CurrentChat';
import Chat from './../../Components/Chat/Chat';


class DB {
  constructor() {
    this.messages = {
      "Имя": [
        {text: "cmsdkl", isMy: false, time: "14.00"}, 
        {text: "ojedsvmk", isMy: true, time: "14.10"}, 
        {text: "vdklmmm.kmjkf", isMy: false, time: "14.30"}
      ],
      "Имя2": [
        {text: "Привет", isMy: true, time: "14.00"}, 
        {text: "Как ты?", isMy: true, time: "14.00"}, 
        {text: "Привет", isMy: false, time: "14.10"}, 
        {text: "норм", isMy: false, time: "14.10"}, 
      ],
      "Имя3": [
        {text: "Привет", isMy: true, time: "14.10"}, 
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

  renderChat(i) {
    if (i < this.state.names.length) {
      const messages = this.db.getMessages(this.state.names[i])
      const lastMessage = messages[messages.length - 1]
      return <Chat name={this.state.names[i]} text={lastMessage.text} time={lastMessage.time} onClick={() => this.handleClick(this.state.names[i])}/>
    }
    return null
  }

  render() {
    return (
      <Container maxWidth={false} className="App">
        <Header/>
        <Paper>
          <Paper className="searchAndDataCurrentChat">    
            <Grid item xs={4}>
              <TextField id="search" className="searchLabel" label="Поиск" />
            </Grid>
            <Grid item xs={8}>
              <Box className="dataCurrentChat">
                <Box className="currentChatName">
                  {this.state.name}
                </Box>
                <Box className="lastEnter">
                  был(а) в сети в 12.30
                </Box>
              </Box>
            </Grid>
          </Paper>
          <Box className="chats" height={window.innerHeight * 65 / 100}> 
            <Grid item xs={4}>   
              {this.renderChat(0)}
              {this.renderChat(1)}
              {this.renderChat(2)} 
              {this.renderChat(3)} 
            </Grid>  
            <CurrentChat name={this.state.name} messages={this.state.messages} db={this.db} onClick={()=>this.getTextMessage()}/>
          </Box>
        </Paper>
      </Container>
  
    );
  }
}

export default App;