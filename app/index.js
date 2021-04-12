const http = require('http');
const fs = require("fs");

const hostname = '';
const port = 8080;
const surgeDomain = "http://messenger.ufru.surge.sh/"

const server = http.createServer((req, res) => {
  if(req.url == "/index.html") {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(301, {Location: surgeDomain})
    res.end();
    return;
  };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(process.env.PORT || port, hostname, () => {
    console.log(process.env.PORT)
    console.log(`Server running at http://${hostname}:${port}/`);
});
