import bodyParser from "body-parser"
import express from "express"
import fetch from "node-fetch"
import type { User } from "./models/user"
const { client_id, redirect_uri, client_secret, lifetime } = require("./config")
const MongoClient = require("mongodb").MongoClient
const app = express()

const MONGO_USER = "messenger"
const MONGO_PASSWORD = process.env["MONGO_PASSWORD"]

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@messengercluster.zgsoy.mongodb.net/userStorage?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

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
	})
		.then((response: { text: () => any }) => {
			return response.text()
		})
		.then((paramsString: string | string[][] | Record<string, string> | URLSearchParams | undefined) => {
			const params = new URLSearchParams(paramsString)
			const access_token = params.get("access_token")

			// Request to return data of a user that has been authenticated
			return fetch("https://api.github.com/user", {
				headers: {
					Authorization: `token ${access_token}`,
				},
			})
		})
		.then((response: { json: () => any }) => response.json())
		.then(workWithDb)
		.catch((error: any) => {
			return res.status(400).json(error)
		})

	async function workWithDb(response: { [x: string]: any }) {
		const user: User = {name: response.login, avatar: response.avatar_url, online: true}

		try {
			await client.connect()
			const usersCollection = client.db("userStorage").collection("users")

			if (await usersCollection.findOne({name: user.name}) !== null) {
				await usersCollection.updateOne({name: user.name}, {$set: {isLogin: true}})
				console.debug(`User ${user.name} is login`)
			} else {
				const insertedUser = await usersCollection.insertOne(user)
				console.debug(`User ${insertedUser.name} save in database`)
			}
		} finally {
			await client.close()
		}
		const partResp = {"login": response.login, "avatar_url": response.avatar_url, "lifetime": lifetime}
		return res.status(200).json(partResp)
	}
})

app.post("/logout", async (req, res) => {
	const userName = req.body.login
	try {
		await client.connect()
		const usersCollection = client.db("userStorage").collection("users")

		if (await usersCollection.findOne({name: userName}) !== null) {
			await usersCollection.updateOne({name: userName}, {$set: {isLogin: false}})
			console.debug(`User ${userName} is logout`)
		}
	} finally {
		await client.close()
	}
	return res.status(200)
})

app.get("/api/users", async (req, res) => {
	const userName = req.body.login
	try {
		await client.connect()
		const usersCollection = client.db("userStorage").collection("users")

		if (await usersCollection.findOne({name: userName}) !== null && await usersCollection.findOne({name: userName}).login) {
			// достанет всех пользователей из базы
			const allUsers: User[] = await usersCollection.find({}).toArray()
			const allUsersResult = JSON.stringify(allUsers.map((user) => {user.name}))
			return res.status(200).json(allUsersResult)
		} else return res.status(403)
	} finally {
		await client.close()
	}
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on http://localhost:${port}/api/`))
