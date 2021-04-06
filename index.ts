import http, {IncomingMessage, ServerResponse} from "http"
import fs from 'fs'

const hostname = "127.0.0.1"
const port = 3000

const server = http.createServer((req: IncomingMessage, res: ServerResponse ) => {
	res.statusCode = 200
	res.setHeader("Content-Type", "text/plain")
	const file: Buffer = fs.readFileSync('./index.html')
	res.end(file.toString())
})

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
})
