import bodyParser from "body-parser"
import express from "express"
import fetch from "node-fetch"
import type { User } from "./models/user"
import type { Message} from "./models/message"
import { getOneUser, getAllUsers } from "./helpers/db_helpers"

const { client_id, redirect_uri, client_secret, lifetime, mongo_user, mongo_password } = require("./config")
const MongoClient = require("mongodb").MongoClient
const app = express()

const uri_users = `mongodb+srv://${mongo_user}:${mongo_password}@messengercluster.zgsoy.mongodb.net/userStorage?retryWrites=true&w=majority`
const client_users = new MongoClient(uri_users, { useNewUrlParser: true, useUnifiedTopology: true })

const uri_messages = `mongodb+srv://${mongo_user}:${mongo_password}@messengercluster.zgsoy.mongodb.net/messagesStorage?retryWrites=true&w=majority`
const client_messages = new MongoClient(uri_messages, { useNewUrlParser: true, useUnifiedTopology: true })

client_users.connect()
client_messages.connect()

const usersCollection = client_users.db("userStorage").collection("users")
const messagesCollection = client_messages.db("messagesStorage").collection("message")
const delayedMessagesCollection = client_messages.db("messagesStorage").collection("delayedMessages")

app.use(bodyParser.json())
app.use(bodyParser.json({ type: "text/*" }))
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	next()
})

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
		.then((response)  => {
			const access_token = response.access_token

			// Request to return data of a user that has been authenticated
			return fetch("https://api.github.com/user", {
				headers: {
					Authorization: `token ${access_token}`,
				},
			})
		})
		.then((response => response.json()))
		.then(async response => {
			const user: User = {name: response.login, avatar: response.avatar_url, online: true}
			try {
				if (await getOneUser(usersCollection, user.name)) {
					await usersCollection.updateOne({name: user.name}, {$set: {isLogin: true}})
					console.debug(`User ${user.name} is login`)
				} else {
					const insertedUser = await usersCollection.insertOne(user)
					console.debug(`User ${insertedUser.name} save in database`)
				}
			} finally {
				console.debug("In finally block")
			}
			const partResp = {"login": response.login, "avatar_url": response.avatar_url, "lifetime": lifetime}
			return res.status(200).json(partResp)
		})
		.catch((error: Error) => {
			return res.status(400).json(error)
		})
})

app.post("/api/logout", async (req, res) => {
	const userName = req.body.login
	try {
		if (await getOneUser(usersCollection, userName)) {
			await usersCollection.updateOne({name: userName}, {$set: {isLogin: false}})
			console.debug(`User ${userName} is logout`)
			return res.status(200).json("Success logout")
		} else return res.status(403).json("Forbidden")
	} catch (error) {
		console.debug(error)
		return res.json("Sorry, application is crashed)").status(503)
	}
})


app.post("/api/users", async (req, res) => {
	const userName = req.body.login
	try {
		const userData = await getOneUser(usersCollection, userName)
		if (userData !== null && userData.isLogin) {
			const allUsers: User[] = await getAllUsers(usersCollection)
			return res.status(200).json(allUsers.map(user => user.name))
		} else if (userData === null) {
			return res.status(400).json("Incorrect body")
		}
		else {
			return res.status(403).json("Forbidden")
		}
	} catch (error) {
		console.debug(error)
		return res.json("Sorry, application is crashed)").status(503)
	}
})

// Получить последние сообщения и аватарки других пользователей
app.post("/api/lastMessages", async (req, res) => {
	const currentUserName = req.body.currentUserName
	const ans : any = {}
	ans["messages"] = {}
	ans["avatars"] = {}

	try {
		let date = new Date()
		let h = date.getHours() + 5
		if (h >= 24) {
			h -= 24
		}
		let firstSym = ""
		if (h < 10) {
			firstSym = "0"
		}
		let dateStr = firstSym + h + "." + date.getMinutes()
		const messagesShouldSend = await delayedMessagesCollection.find({time: dateStr}).toArray()
		
		for (let i = 0; i < messagesShouldSend.length; i++) {
			await messagesCollection.insertOne(messagesShouldSend[i])
			await delayedMessagesCollection.deleteOne(messagesShouldSend[i])
		}
		date = new Date()
		h = date.getHours() + 5
		if (h >= 24) {
			h -= 24
		}
		firstSym = ""
		if (h < 10) {
			firstSym = "0"
		}
		dateStr = firstSym + h + "." + date.getMinutes()
		const result3 = await messagesCollection.deleteMany({timeDelete: dateStr})
		console.debug(`${result3.deletedCount} documents with message information were deleted with time ${dateStr}.`)

		const allMessages = await messagesCollection.find({}).toArray()
		
		for (let i = allMessages.length - 1; i >= 0; i--) {
			const fromUser = allMessages[i].from
			const toUser = allMessages[i].to
			if (fromUser === currentUserName || toUser === currentUserName) {
				if (!Object.prototype.hasOwnProperty.call(ans["messages"], fromUser)) {
					ans["messages"][fromUser] = {text: allMessages[i].text, isMy: true, time: allMessages[i].time, timeDelete: allMessages[i].timeDelete }
					const fromUserData = await getOneUser(usersCollection, fromUser)
					ans["avatars"][fromUser] = fromUserData.avatar
				}
				if (!Object.prototype.hasOwnProperty.call(ans["messages"], toUser)) {
					ans["messages"][toUser] = {text: allMessages[i].text, isMy: false, time: allMessages[i].time, timeDelete: allMessages[i].timeDelete }
					const toUserData = await getOneUser(usersCollection, fromUser)
					ans["avatars"][toUser] = toUserData.avatar
				}
			}
		}

		const allUsers: User[] = await getAllUsers(usersCollection)
		const allUsersNames = allUsers.map(user => user.name)
		// если сообщений между пользователями еще не было
		for (const name of allUsersNames) {
			if (!Object.prototype.hasOwnProperty.call(ans["messages"], name)) {
				ans["messages"][name] = {text: "Начните чат", isMy: true, time: "00.00", timeDelete: null}
				ans["avatars"][name] = allUsers.filter(user => user.name == name)[0].avatar
			}
		}
	} catch (error) {
		console.debug(error)
		return res.json("Sorry, application is crashed)")
	}
	return res.json(ans)
})

// Получить сообщения между двумя пользователями
app.post("/api/messages", async (req, res) => {
	const currentUserName = req.body.currentUserName
	const interlocutorUserName = req.body.interlocutorUserName
	const messages : any = []
	try {
		const allMessages = await messagesCollection.find({}).toArray()
		for (let i = 0; i < allMessages.length; i++) {
			if (allMessages[i].from === currentUserName && allMessages[i].to === interlocutorUserName)
				messages.push({text: allMessages[i].text, isMy: true, time: allMessages[i].time, timeDelete: allMessages[i].timeDelete })
			else if (allMessages[i].from === interlocutorUserName && allMessages[i].to === currentUserName)
				messages.push({text: allMessages[i].text, isMy: false, time: allMessages[i].time, timeDelete: allMessages[i].timeDelete })
		}
	} catch (error) {
		console.debug(error)
		return res.json("Sorry, application is crashed)")
	}
	return res.json({"messages": messages})
})

// Добавить сообщение {text: string, isMy: bool, time: string} между двумя пользователями
app.post("/api/addMessage", async (req, res) => {
	const message = req.body.message
	const interlocutorUserName = req.body.interlocutorUserName
	const currentUserName = req.body.currentUserName
	const shouldSendLater = req.body.shouldSendLater
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

	try {
		if (!shouldSendLater) {
			const messageInformation: Message = { from: fromUser, to: toUser, text: message.text, time: message.time, isMy: message.isMy, timeDelete: message.timeDelete }
			const result = await messagesCollection.insertOne(messageInformation)
			console.debug(`${result.insertedCount} documents with message information were inserted with the _id: ${result.insertedId}`)
		}
		else {
			const messageInformation: Message = { from: fromUser, to: toUser, text: message.text, time: message.time, isMy: message.isMy, timeDelete: message.timeDelete }
			await delayedMessagesCollection.insertOne(messageInformation)
		}
	} catch (error) {
		console.debug(error)
		return res.json("Sorry, application is crashed)")
	}
	return res.json({"status": true})
})

app.post("/api/changeMessage", async (req, res) => {
	const message = req.body.message
	const interlocutorUserName = req.body.interlocutorUserName
	const currentUserName = req.body.currentUserName
	const newText = req.body.newText
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

	try {
		const messageInformation: Message = { from: fromUser, to: toUser, text: message.text, time: message.time, isMy: message.isMy, timeDelete: message.timeDelete }
		await messagesCollection.update(messageInformation, {$set: {text: newText}})
	} catch (error) {
		console.debug(error)
		return res.json("Sorry, application is crashed)")
	}
	return res.json({"status": true})
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on http://localhost:${port}/api/`))
