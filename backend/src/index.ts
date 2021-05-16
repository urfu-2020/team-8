import bodyParser from "body-parser"
import express from "express"
const { client_id, redirect_uri, client_secret, lifetime } = require("./config");
import fetch from "node-fetch";
import {Users, User} from "./db";

const app = express()
const db = new Users()

app.use(bodyParser.json())
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
  
/*
  req.body - code to exchange for an authorization token

  res.login - login in Github
  res.avatar_url - avatar in Github
  res.lifetime - lifetime of Github authorization token
*/
app.post("/api/authenticate", (req, res) => {
  const { code } = req.body;
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
      'Content-Type':'application/json',
      'Accept':'application/json'
    }
  })
  .then((response) => response.json())
  .then((response) => {
    const access_token = response.access_token;

    // Request to return data of a user that has been authenticated
    return fetch(`https://api.github.com/user`, { 
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
  })
  .then((response) => response.json())
  .then((response) => {
    let user = new User(response.login, response.avatar_url, true)
    let userName = response.login
    if (db.hasOwnProperty(userName)) {
          db[userName].isLogin = true
    }
    else {
      db[userName] = user
    }
    let partResp = {login: response.login, avatar_url: response.avatar_url, lifetime: lifetime} 
    return res.status(200).json(partResp);
  })
  .catch((error) => {
    return res.status(400).json(error);
  });
});

app.post("/logout", (req, res) => {
  let userName = req.body.login
  if (db.hasOwnProperty(userName)) {
      db[userName].isLogin = false
  }
});


const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on http://localhost:${port}/api/`))
