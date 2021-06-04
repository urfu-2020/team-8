"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
var config = {
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    client_secret: process.env.CLIENT_SECRET,
    proxy_url: process.env.PROXY_URL,
    lifetime: 15 * Math.pow(10, 3) * 60,
    mongo_user: process.env.MONGO_USER,
    mongo_password: process.env.MONGO_PASSWORD
};
module.exports = config;
