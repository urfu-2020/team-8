import bodyParser from "body-parser"
import express from "express"

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/api/", (req, res) => res.json({hello: "world"}))

app.listen(port, () => console.log(`Listening on http://localhost:${port}/api/`))
