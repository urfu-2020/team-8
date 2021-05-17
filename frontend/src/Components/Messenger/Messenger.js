import React from "react"
import "./Messenger.css"
import Container from "@material-ui/core/Container"
import Box from "@material-ui/core/Box"
import { Paper, Grid, TextField } from "@material-ui/core"
import Header from "../Header/Header"
import CurrentChat from "../CurrentChat/CurrentChat"
import Contact from "../Contact/Contact"
import getFormattedDate from "../../utils/date.utils"
import {Avatar } from "@material-ui/core"



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
			],
			"Имя4": [
				{id: "9", text: "qwertyuiop", isMy: false, time: "14.00"}, 
				{id: "10", text: "zxcvbnm", isMy: false, time: "14.50"},
			]
		}
	}
	getMessages(name="Имя", n=10) { // ограничение по кол-ву сообщений чтобы все влезло, потом скролл будет
		let messages = this.messages[name]
		n = Math.min(n, messages.length)
		return messages.slice(messages.length - n)
	}

	addMessage(name="Имя", text_mes="", isMy_mes=false, time_mes="") {
		if (text_mes !== "")
			this.messages[name].push({text: text_mes, isMy: isMy_mes, time: time_mes})
	}

	getNames() {
		return Object.keys(this.messages)
	}
}

class Messenger extends React.Component {
	constructor(props) {
		super(props)
		this.db = new DB()
		let names = this.db.getNames()
		this.state = {
			names: names,
			messages: this.db.getMessages(names[0]),
			name: names[0],
			message: ""
		}
		this.handleWriteMessage = this.handleWriteMessage.bind(this)
	}  

	getTextMessage() {
		this.db.addMessage(this.state.name, this.state.message, true, getFormattedDate(new Date()))
		const messages = this.db.getMessages(this.state.name)
		this.setState({messages: messages})
		this.setState({
			message: ""
		})
	}

	handleWriteMessage(e) {
		this.setState({
			message: e.target.value
		})
	}

	handleClickContact(name) {
		const messages = this.db.getMessages(name)
		this.setState({name: name, messages: messages, message: ""})
	}

	render() {
		return (
			<Container maxWidth={false}>
				<Header handleLogout={this.props.handleLogout}/>
				<Paper>
					<Paper className="container">
						<Grid item xs={1}>
							<Box className="container__data-user">
								<Avatar alt="Remy Sharp" src={this.props.avatar}/>
								{this.props.login}
							</Box>
						</Grid>    
						<Grid item xs={4}>
							<TextField id="search" className="container__search-label" label="Поиск" />
						</Grid>
						<Grid item xs={8}>
							<Box className="container__current-contact" ml={1} p={2.5}>
								<Box className="container__current-contact__name">
									{this.state.name}
								</Box>
								<Box className="container__current-contact__last-enter">
                  был(а) в сети в 12.30
								</Box>
							</Box>
						</Grid>
					</Paper>
					<Box height="65vh">
						<Grid item xs={12} className="contacts"> 
							<Grid item xs={4}>        
								{
									this.state.names.map(name => {
										const messages = this.db.getMessages(name)
										const lastMessage = messages[messages.length - 1]
										return <Contact 
											key={name} 
											name={name} 
											lastText={lastMessage.text} 
											time={lastMessage.time} 
											handleClickContact={() => this.handleClickContact(name)}/>
									})
								}
							</Grid>  
							<CurrentChat 
								message={this.state.message} 
								handleWriteMessage={this.handleWriteMessage} 
								messages={this.state.messages} 
								onClick={() => this.getTextMessage()}/>
						</Grid>
					</Box>
				</Paper>
			</Container>
		)
	}
}

export default Messenger