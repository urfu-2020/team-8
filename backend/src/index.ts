import bodyParser from "body-parser"
import express from "express"
const { client_id, redirect_uri, client_secret, lifetime } = require("./config")
import fetch from "node-fetch"
import {Users, User} from "./db"

const app = express()
const db = new Users()
db["Имя"] = new User("Имя", "")
db["Имя2"] = new User("Имя2", "")
db["Имя3"] = new User("Имя3", "")
db["Имя4"] = new User("Имя4", "")


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
				if (response.login !== "Svetlana1200"){ /////////////
					for (let k of Object.keys(db)) {
						dialogs.push({dialog_id: dialogs.length + 1, dialog_one_user_id: response.login, dialog_two_user_id: k})
					}
				}
				db[userName] = user
			}
			console.log(response.login)
			
			console.log(db)
			console.log(dialogs)
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

let dialogs = [
	{dialog_id: 1, dialog_one_user_id: "Svetlana1200", dialog_two_user_id: "Имя"},
	{dialog_id: 2, dialog_one_user_id: "Svetlana1200", dialog_two_user_id: "Имя2"},
	{dialog_id: 3, dialog_one_user_id: "Svetlana1200", dialog_two_user_id: "Имя3"},
	{dialog_id: 4, dialog_one_user_id: "Svetlana1200", dialog_two_user_id: "Имя4"},
]
let m = [
	{chat_messages_id: 1, chat_messages_text: "cmsdkl", chat_messages_fk_dialog_id: 1, chat_messages_fk_user_id: "Имя", chat_messages_fk_to_user_id: "Svetlana1200", chat_messages_time: "14.00"},
	{chat_messages_id: 4, chat_messages_text: "Привет", chat_messages_fk_dialog_id: 2, chat_messages_fk_user_id: "Svetlana1200", chat_messages_fk_to_user_id: "Имя2", chat_messages_time: "14.00"},
	{chat_messages_id: 5, chat_messages_text: "Как ты?", chat_messages_fk_dialog_id: 2, chat_messages_fk_user_id: "Svetlana1200", chat_messages_fk_to_user_id: "Имя2", chat_messages_time: "14.00"},
	{chat_messages_id: 9, chat_messages_text: "qwertyuiop", chat_messages_fk_dialog_id: 4, chat_messages_fk_user_id: "Имя4", chat_messages_fk_to_user_id: "Svetlana1200", chat_messages_time: "14.00"},
	{chat_messages_id: 2, chat_messages_text: "ojedsvmk", chat_messages_fk_dialog_id: 1, chat_messages_fk_user_id: "Svetlana1200", chat_messages_fk_to_user_id: "Имя", chat_messages_time: "14.10"},
	{chat_messages_id: 6, chat_messages_text: "Привет", chat_messages_fk_dialog_id: 2, chat_messages_fk_user_id: "Имя2", chat_messages_fk_to_user_id: "Svetlana1200", chat_messages_time: "14.10"},
	{chat_messages_id: 7, chat_messages_text: "норм", chat_messages_fk_dialog_id: 2, chat_messages_fk_user_id: "Имя2", chat_messages_fk_to_user_id: "Svetlana1200", chat_messages_time: "14.10"},
	{chat_messages_id: 8, chat_messages_text: "Привет", chat_messages_fk_dialog_id: 3, chat_messages_fk_user_id: "Svetlana1200", chat_messages_fk_to_user_id: "Имя3", chat_messages_time: "14.10"},
	{chat_messages_id: 3, chat_messages_text: "vdklmmm.kmjkf", chat_messages_fk_dialog_id: 1, chat_messages_fk_user_id: "Имя", chat_messages_fk_to_user_id: "Svetlana1200", chat_messages_time: "14.30"},
	{chat_messages_id: 10, chat_messages_text: "zxcvbnm", chat_messages_fk_dialog_id: 4, chat_messages_fk_user_id: "Имя4", chat_messages_fk_to_user_id: "Svetlana1200", chat_messages_time: "14.50"},
]

app.post("/api/names", (req, res) => {
	let curName = req.body.currentName
	let names = Object.keys(db)
	console.log(curName)
	console.log(names)
	let ans : any = {}
	for (let i = m.length - 1; i >= 0; i--) {
		let a = m[i].chat_messages_fk_user_id
		let b = m[i].chat_messages_fk_to_user_id
		if (a === curName || b === curName) {
			if (!ans.hasOwnProperty(a))
				ans[a] = {text: m[i].chat_messages_text, isMy: true, time: m[i].chat_messages_time }
			if (!ans.hasOwnProperty(b))
				ans[b] = {text: m[i].chat_messages_text, isMy: false, time: m[i].chat_messages_time }
		}
	}
	for (let name of names) {
		if (!ans.hasOwnProperty(name))
			ans[name] = {text: "Начните чат", isMy: true, time: "00.00"}
	}
	return res.json(ans)	
})

app.post("/api/messages", (req, res) => {
	let currentName = req.body.currentName
	let name = req.body.name
	let messages : any = []
	for (let i = 0; i < m.length; i++) {
		if (m[i].chat_messages_fk_user_id === currentName && m[i].chat_messages_fk_to_user_id === name)
			messages.push({text: m[i].chat_messages_text, isMy: true, time: m[i].chat_messages_time })
		else if (m[i].chat_messages_fk_user_id === name && m[i].chat_messages_fk_to_user_id === currentName)
			messages.push({text: m[i].chat_messages_text, isMy: false, time: m[i].chat_messages_time })
	}
	return res.json({"messages": messages})
})

app.post("/api/addMessage", (req, res) => {
	let message = req.body.message
	let name = req.body.name
	let currentName = req.body.currentName
	let dialogId = 0
	for (var i = 0; i < dialogs.length; i++) {
		if (dialogs[i].dialog_one_user_id === currentName && dialogs[i].dialog_two_user_id === name 
			|| dialogs[i].dialog_one_user_id === name && dialogs[i].dialog_two_user_id === currentName) {
				dialogId = i + 1
			}
	}	
	let a
	let b
	if (message.isMy)
	{
		a = currentName
		b = name
	}
	else
	{
		a = name
		b = currentName
	}
	m.push({
		chat_messages_id: m.length + 1, chat_messages_text: message.text, chat_messages_fk_dialog_id: dialogId, chat_messages_fk_user_id: a, chat_messages_fk_to_user_id: b, chat_messages_time: message.time
	})
	//messages[name].push(message)
	return res.json({"status": true})
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on http://localhost:${port}/api/`))
