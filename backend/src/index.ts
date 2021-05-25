import bodyParser from "body-parser"
import express from "express"
const { client_id, redirect_uri, client_secret, lifetime } = require("./config")
import fetch from "node-fetch"
import {Users, User} from "./db"
import {Message} from "./Message"

const app = express()
const db = new Users()
let allMessages : Message[] = [] // сообщения имеют следующий вид {messageText: "text", fromUser: "from", toUser: "to", messageTime: "time"}


app.use(bodyParser.json())
app.use(bodyParser.json({ type: "text/*" }))
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	next()
})

/*
  req.body - code to exchange for an authorization token

  res.login - login in Github
  res.avatar_url - avatar in Github
  res.lifetime - lifetime of Github authorization token
*/
app.post("/api/authenticate", (req, res) => {
	const { code } = req.body
	const data = JSON.stringify({
		client_id: client_id,
		client_secret: client_secret,
		code: code,
		redirect_uri: redirect_uri
	})

	// Request to exchange code for an access token
	fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		body: data,
		headers: {
			"Content-Type":"application/json",
			"Accept":"application/json"
		}
	})
		.then((response) => response.json())
		.then((response) => {
			const access_token = response.access_token

			// Request to return data of a user that has been authenticated
			return fetch("https://api.github.com/user", {
				headers: {
					Authorization: `token ${access_token}`,
				},
			})
		})
		.then((response) => response.json())
		.then((response) => {
			const user = new User(response.login, response.avatar_url, true)
			const userName = response.login

			if (db[userName]) {
				db[userName].isLogin = true
			}
			else {
				db[userName] = user
			}
			const partResp = {login: response.login, avatar_url: response.avatar_url, lifetime: lifetime}
			return res.status(200).json(partResp)
		})
		.catch((error) => {
			return res.status(400).json(error)
		})
})

app.post("/logout", (req) => {
	const userName = req.body.login
	if (db[userName]) {
		db[userName].isLogin = false
	}
	
})


// Получить последние сообщения и аватарки других пользователей
app.post("/api/lastMessages", (req, res) => {
	let currentUserName = req.body.currentUserName
	let names = Object.keys(db)
	let ans : any = {}
	ans["messages"] = {}
	ans["avatars"] = {}
	
	for (let i = allMessages.length - 1; i >= 0; i--) {
		let fromUser = allMessages[i].from.name
		let toUser = allMessages[i].to.name
		if (fromUser === currentUserName || toUser === currentUserName) {
			if (!Object.prototype.hasOwnProperty.call(ans["messages"], fromUser)) {
				ans["messages"][fromUser] = {text: allMessages[i].text, isMy: true, time: allMessages[i].time }
				ans["avatars"][fromUser] = db[fromUser].avatar
			}
			if (!Object.prototype.hasOwnProperty.call(ans["messages"], toUser)) {
				ans["messages"][toUser] = {text: allMessages[i].text, isMy: false, time: allMessages[i].time }
				ans["avatars"][toUser] = db[toUser].avatar
			}
		}
	}
	// если сообщений между пользователями еще не было
	for (let name of names) {
		if (!Object.prototype.hasOwnProperty.call(ans["messages"], name)) {
			ans["messages"][name] = {text: "Начните чат", isMy: true, time: "00.00"}
			ans["avatars"][name] = db[name].avatar
		}
	}
	return res.json(ans)
})

// Получить сообщения между двумя пользователями
app.post("/api/messages", (req, res) => {
	let currentUserName = req.body.currentUserName
	let interlocutorUserName = req.body.interlocutorUserName
	let messages : any = []
	for (let i = 0; i < allMessages.length; i++) {
		if (allMessages[i].from.name === currentUserName && allMessages[i].to.name === interlocutorUserName)
			messages.push({text: allMessages[i].text, isMy: true, time: allMessages[i].time })
		else if (allMessages[i].from.name === interlocutorUserName && allMessages[i].to.name === currentUserName)
			messages.push({text: allMessages[i].text, isMy: false, time: allMessages[i].time })
	}
	return res.json({"messages": messages})
})

// Добавить сообщение {text: string, isMy: bool, time: string} между двумя пользователями 
app.post("/api/addMessage", (req, res) => {
	let message = req.body.message
	let interlocutorUserName = req.body.interlocutorUserName
	let currentUserName = req.body.currentUserName
	let fromUser
	let toUser
	if (message.isMy) {
		fromUser = currentUserName
		toUser = interlocutorUserName
	}
	else {
		fromUser = interlocutorUserName
		toUser = currentUserName
	}
	allMessages.push({
		text: message.text, from: db[fromUser], to: db[toUser], time: message.time
	})
	return res.json({"status": true})
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on http://localhost:${port}/api/`))
