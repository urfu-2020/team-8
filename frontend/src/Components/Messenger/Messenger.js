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


class Messenger extends React.Component {
	constructor(props) {
		super(props)		
		let names = []
		this.state = {
			names: names,
			messages: [],
			name: names[0],
			lastMessages: {},
			message: "",
		}
		this.handleWriteMessage = this.handleWriteMessage.bind(this)
	}  

	tick() {
		console.log("tick")
		fetch("http://localhost:5000/api/messages", {
			method: "POST",
			body: JSON.stringify({"name": this.state.name, "currentName": this.props.login}),
		})
			.then(res2 => res2.json())
			.then(
				(res2) => {
					this.setState({
						messages: res2.messages
					})
				}
			)
		fetch("http://localhost:5000/api/names", {
			method: "POST",
			body: JSON.stringify({"currentName": this.props.login})
		})
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						names: Object.keys(result),
						lastMessages: result
					})
				}
			)
	}

	componentDidMount() {
		this.timerID = setInterval(
			() => this.tick(),
			1000
		)

		fetch("http://localhost:5000/api/names",{
			method: "POST",
			body: JSON.stringify({"currentName": this.props.login})
		})
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						names: Object.keys(result),
						name: Object.keys(result)[0],
						lastMessages: result
					})
					fetch("http://localhost:5000/api/messages", {
						method: "POST",
						body: JSON.stringify({"name": this.state.name, "currentName": this.props.login}),
					})
						.then(res2 => res2.json())
						.then(
							(res2) => {
								this.setState({
									messages: res2.messages
								})
							}
						)
				},
				(error) => {
					console.log("Problem")
				}
			)
		
	}

	componentDidUpdate(prevProps, prevState) {
		console.log(this.state)
		
		if (this.state.name !== prevState.name || this.state.message === "" && prevState.message !== "") {
			fetch("http://localhost:5000/api/messages", {
				method: "POST",
				body: JSON.stringify({"name": this.state.name, "currentName": this.props.login}),
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
		if (this.state.message == "" && prevState.message !== "") {
			fetch("http://localhost:5000/api/names")
				.then(res => res.json())
				.then(
					(result) => {
						this.setState({
							lastMessages: result
						})
					}
				)
		}
	}

	getTextMessage() {
		if (this.state.message !== "")
		{
			let date = new Date()
			let message = {text: this.state.message, isMy: true, time: date.getHours() + "." + date.getMinutes()} // TODO getFormattedDate(new Date())} 

			fetch("http://localhost:5000/api/addMessage", {
				method: "POST",
				body: JSON.stringify({"name": this.state.name, "message": message, "currentName": this.props.login})
			})
				.then((res) => {				
					console.log(this.state.message)
					this.setState({
						message: ""
					})
				})
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
										if (name !== this.props.login) {
											const lastMessage = this.state.lastMessages[name]
											return <Contact 
												key={name} 
												name={name} 
												lastText={lastMessage.text} 
												time={lastMessage.time} 
												handleClickContact={() => this.handleClickContact(name)}/>
										}
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