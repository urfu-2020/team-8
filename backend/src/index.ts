import bodyParser from "body-parser"
import express from "express"
import FormData from "form-data";
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

app.post("/authenticate", (req, res) => {
    const { code } = req.body;
    const data = new FormData();
    data.append("client_id", client_id);
    data.append("client_secret", client_secret);
    data.append("code", code);
    data.append("redirect_uri", redirect_uri);

    // Request to exchange code for an access token
    fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        body: data,
    })
        .then((response) => {
        return response.text()
        })
        .then((paramsString) => {
        let params = new URLSearchParams(paramsString);
        const access_token = params.get("access_token");

        // Request to return data of a user that has been authenticated
        return fetch(`https://api.github.com/user`, { 
            headers: {
            Authorization: `token ${access_token}`,
            },
        });
        })
        .then((response) => response.json())
      .then((response) => {
        let user = new User( response["login"], response["avatar_url"], true)
        let userName = response["login"]
        if (db.hasOwnProperty(userName)) {
              db[userName]["isLogin"] = true
        }
        else {
          db[userName] = user
        }
        console.log(db)
        let partResp = {"login": response["login"], "avatar_url": response["avatar_url"], "lifetime": lifetime} 
        return res.status(200).json(partResp);
      })
      .catch((error) => {
        return res.status(400).json(error);
      });
  });

app.get("/api/", (req, res) => {
    return res.json({hello: "world"})
})


app.post("/logout", (req, res) => {
  let userName = req.body["login"]
  if (db.hasOwnProperty(userName)) {
      db[userName]["isLogin"] = false
  }
  console.log(db)
});


const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on http://localhost:${port}/api/`))
