import React from "react"
import "./Messenger.css"
import Container from "@material-ui/core/Container"
import Box from "@material-ui/core/Box"
import { Paper, Grid, TextField } from "@material-ui/core"
import Header from "../Header/Header"
import CurrentChat from "../CurrentChat/CurrentChat"
import Contact from "../Contact/Contact"
//import getFormattedDate from "../../utils/date.utils"
import {Avatar } from "@material-ui/core"

import { ThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import themeLight from "../../themeLight"
import themeDark from "../../themeDark"
import config from "../../config"


class Messenger extends React.Component {
	constructor(props) {
		super(props)		
		this.state = {
			names: [],
			messages: [],
			name: "",
			lastMessages: {},
			avatars: {},
			message: "",
			isDarkTheme: false,
			messageForChange: null,
			isTurnOnTimerDelete: false,
			isTurnOnTimerSend: false,
			
		}
		this.handleWriteMessage = this.handleWriteMessage.bind(this)
		this.handleChangeTheme = this.handleChangeTheme.bind(this)
	}  

	update() {
		fetch(`${config().host}/api/lastMessages`, {
			method: "POST",
			body: JSON.stringify({"currentUserName": this.props.login})
		})
			.then(res => res.json())
			.then(
				(result) => {
					let names = Object.keys(result.messages).filter(name => name !== this.props.login)
					let name = this.state.name
					if (!name && names.length > 0) {
						name = names[0]
					}
					this.setState({
						names: names,
						name: name,
						lastMessages: result.messages,
						avatars: result.avatars
					})
					fetch(`${config().host}/api/messages`, {
						method: "POST",
						body: JSON.stringify({"interlocutorUserName": this.state.name, "currentUserName": this.props.login}),
					})
						.then(res2 => res2.json())
						.then(
							(res2) => {
								this.setState({
									messages: res2.messages
								})
							}
						)
				}
			)
	}

	componentDidMount() {
		this.timerID = setInterval(
			() => this.update(),
			5000
		)
		this.update()
	}

	componentDidUpdate(prevProps, prevState) {	
		if (this.state.name !== prevState.name)
			this.update()
		else if (this.state.message === "" && prevState.message !== "")
			this.update()
	}

	getTextMessage() {
		if (this.state.message) {
			let date = new Date()
			let timeDelete = null
			let minutesDelete = config().minutesDelete
			let minutesSend = config().minutesSend
			if (this.state.isTurnOnTimerDelete) {
				let minutes = minutesDelete
				if (this.state.isTurnOnTimerSend) {
					minutes += minutesSend
				}
				let newDate = new Date(date.getTime() + (minutes * 60 * 1000))
				timeDelete = newDate.getHours() + "." + newDate.getMinutes()
			}
			let message = {text: this.state.message, isMy: true, time: date.getHours() + "." + date.getMinutes(), timeDelete: timeDelete} // TODO getFormattedDate(new Date())} 
			let shouldSendLater = this.state.isTurnOnTimerSend
			if (this.state.isTurnOnTimerSend) {
				let newDate = new Date(date.getTime() + (minutesSend * 60 * 1000))
				let timeSend = newDate.getHours() + "." + newDate.getMinutes()
				message.time = timeSend
			}
			if (this.state.messageForChange !== null) {
				fetch(`${config().host}/api/changeMessage`, {
					method: "POST",
					body: JSON.stringify({"interlocutorUserName": this.state.name, "message": this.state.messageForChange, "newText": message.text, "currentUserName": this.props.login})
				})
					.then((res) => {
						this.setState({
							message: ""
						})
					})
				this.setState({
					messageForChange: null
				})
			}
			else {
				fetch(`${config().host}/api/addMessage`, {
					method: "POST",
					body: JSON.stringify({"interlocutorUserName": this.state.name, "message": message, "currentUserName": this.props.login, "shouldSendLater": shouldSendLater})
				})
					.then((res) => {
						this.setState({
							message: ""
						})
					})
			}
		}
	}

	handleWriteMessage(e) {
		this.setState({
			message: e.target.value
		})
	}

	handleClickContact(name) {
		this.setState({name: name})
	}

	handleChangeTheme() {
		console.log(this)
		let isDarkTheme = this.state.isDarkTheme
		this.setState({
			isDarkTheme: !isDarkTheme
		})
	}

	onClickMessage = m => e => {
		if (m !== undefined){
			this.setState({
				message: m.text,
				messageForChange: m
			})
		}
	};

	onClickTimerDelete() {
		let isTurnOnTimerDelete = this.state.isTurnOnTimerDelete
		this.setState({
			isTurnOnTimerDelete: !isTurnOnTimerDelete
		})
	}

	onClickTimerSend() {
		let isTurnOnTimerSend = this.state.isTurnOnTimerSend
		this.setState({
			isTurnOnTimerSend: !isTurnOnTimerSend
		})
	}

	render() {
		let currentTheme = themeLight
		if (this.state.isDarkTheme)
			currentTheme = themeDark
		return (
			<ThemeProvider theme={currentTheme}>
				<CssBaseline />
				<Container maxWidth={false}>
					<Header handleLogout={this.props.handleLogout} handleChangeTheme={this.handleChangeTheme}/>
					<Paper>
						<Paper className="container">
							<Grid item xs={1}>
								<Box className="container__data-user">
									<Avatar alt="Remy Sharp" src={this.props.avatar}/>
									{this.props.login}
								</Box>
							</Grid>
							<Grid item xs={4}>
								<TextField id="search" className="container__search-label" label="??????????"/>
							</Grid>
							<Grid item xs={8}>
								<Box className="container__current-contact" ml={1} p={2.5}>
									<Box className="container__current-contact__name">
										{this.state.name ? <Avatar alt="Remy Sharp" src={this.state.avatars[this.state.name]}/> : <div></div>}
										{this.state.name}
									</Box>
									<Box className="container__current-contact__last-enter">
										{this.state.name ? <span>??????(??) ?? ???????? ?? 12.30</span> : <div></div>}
									</Box>
								</Box>
							</Grid>
						</Paper>
						<Box height="65vh">
							<Grid item xs={12} className="contacts">
								<Grid item xs={4}>
									{
										this.state.names.map(name => {
											if (name !== this.props.login) {
												const lastMessage = this.state.lastMessages[name]
												return <Contact
													key={name}
													name={name}
													lastText={lastMessage.text}
													time={lastMessage.time}
													handleClickContact={() => this.handleClickContact(name)}
													avatar={this.state.avatars[name]}/>
											}
											return null
										})
									}
								</Grid>  
								<CurrentChat
									message={this.state.message}
									handleWriteMessage={this.handleWriteMessage}
									messages={this.state.messages}
									onClick={() => this.getTextMessage()}
									hasInterlocutor={this.state.names.length > 0}
									onClickMessage={this.onClickMessage}
									shouldChangeMessage={this.state.messageForChange !== null}
									onClickTimerDelete={() => this.onClickTimerDelete()} 
									isTurnOnTimerDelete={this.state.isTurnOnTimerDelete}
									onClickTimerSend={() => this.onClickTimerSend()}
									isTurnOnTimerSend={this.state.isTurnOnTimerSend}/>
							</Grid>
						</Box>
					</Paper>
				</Container>
			</ThemeProvider>
		)
	}
}

export default Messenger
