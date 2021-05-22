import bodyParser from "body-parser"
import express from "express"
import fetch from "node-fetch"
import type { User } from "./models/user"
const { client_id, redirect_uri, client_secret, lifetime, mongo_user, mongo_password } = require("./config")
const MongoClient = require("mongodb").MongoClient
const app = express()

const uri = `mongodb+srv://${mongo_user}:${mongo_password}@messengercluster.zgsoy.mongodb.net/userStorage?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
client.connect()

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
				const usersCollection = client.db("userStorage").collection("users")

				if (await usersCollection.findOne({name: user.name})) {
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
		const usersCollection = client.db("userStorage").collection("users")
		if (await usersCollection.findOne({name: userName})) {
			await usersCollection.updateOne({name: userName}, {$set: {isLogin: false}})
			console.debug(`User ${userName} is logout`)
			return res.status(200).json("Success logout")
		} else return res.status(403).json("Forbidden")
	} finally {
		console.debug("In finally block")
	}
})


app.get("/api/users", async (req, res) => {
	const userName = req.body.login
	try {
		const usersCollection = await client.db("userStorage").collection("users")
		const userData = await usersCollection.findOne({name: userName})
		if (userData !== null && userData.login) {
			// достанет всех пользователей из базы
			const allUsers: User[] = await usersCollection.find({}).toArray()
			return res.status(200).json(allUsers.map(user => user.name))
		} else if (userData === null) {
			return res.status(400).json("Incorrect body")
		}
		else {
			return res.status(403).json("Forbidden")
		}
	} catch (error) {
		console.debug(error)
		return res.json("Sorry, application is crashed)")
	}
	finally {
		console.debug("In finally block")
	}

})


const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on http://localhost:${port}/api/`))
