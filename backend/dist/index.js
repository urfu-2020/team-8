"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var _a = require("./config"), client_id = _a.client_id, redirect_uri = _a.redirect_uri, client_secret = _a.client_secret, lifetime = _a.lifetime;
var node_fetch_1 = __importDefault(require("node-fetch"));
var db_1 = require("./db");
var app = express_1.default();
var db = new db_1.Users();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.json({ type: "text/*" }));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
/*
  req.body - code to exchange for an authorization token

  res.login - login in Github
  res.avatar_url - avatar in Github
  res.lifetime - lifetime of Github authorization token
*/
app.post("/api/authenticate", function (req, res) {
    var code = req.body.code;
    var data = JSON.stringify({
        client_id: client_id,
        client_secret: client_secret,
        code: code,
        redirect_uri: redirect_uri
    });
    // Request to exchange code for an access token
    node_fetch_1.default("https://github.com/login/oauth/access_token", {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
        .then(function (response) { return response.json(); })
        .then(function (response) {
        var access_token = response.access_token;
        // Request to return data of a user that has been authenticated
        return node_fetch_1.default("https://api.github.com/user", {
            headers: {
                Authorization: "token " + access_token,
            },
        });
    })
        .then(function (response) { return response.json(); })
        .then(function (response) {
        var user = new db_1.User(response.login, response.avatar_url, true);
        var userName = response.login;
        if (db[userName]) {
            db[userName].isLogin = true;
        }
        else {
            db[userName] = user;
        }
        var partResp = { login: response.login, avatar_url: response.avatar_url, lifetime: lifetime };
        return res.status(200).json(partResp);
    })
        .catch(function (error) {
        return res.status(400).json(error);
    });
});
app.post("/logout", function (req) {
    var userName = req.body.login;
    if (db[userName]) {
        db[userName].isLogin = false;
    }
});
var port = process.env.PORT || 5000;
app.listen(port, function () { return console.log("Listening on http://localhost:" + port + "/api/"); });
