const MongoClient = require("mongodb").MongoClient
import type { User } from "../src/models/user"

// connection uri ant set up connection example
// in product environment get user and password from heroku application envs

const MONGO_USER = "messenger"
const MONGO_PASSWORD = "get from heroku env - https://dashboard.heroku.com/apps/messenger-ufru-course/settings"

const uri = `mongodb+srv://messenger:LzDxa4NWtxd4.@H@messengercluster.zgsoy.mongodb.net/userStorage?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

// simple example connect to database userStorage, get collection named users, and insert one document
// async function putDocument() {
// 	try {
// 		await client.connect()
// 		const usersCollection = client.db("userStorage").collection("users")
// 		// create a document to be inserted
// 		const testUser: User = {name: "Ivan", avatar: "url", online: true}
// 		// insert document in database userStorage, users collection
// 		const result = await usersCollection.insertOne(testUser)
// 		console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`)
// 	} finally {
// 		await client.close()
// 	}
// }
// putDocument().catch(console.dir)

// simple example connect to database userStorage, get collection named users, and get one document
async function getDocument() {
	try {
		await client.connect()
		const database = client.db("userStorage")
		const users = database.collection("users")
		// get document by his part
		const readData = await users.findOne({name: "Ivan"})
		console.log(`${readData} documents were retrieve from database`)
	} finally {
		await client.close()
	}
}
getDocument().catch(console.dir)
