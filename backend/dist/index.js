"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var _a = require("./config"), client_id = _a.client_id, redirect_uri = _a.redirect_uri, client_secret = _a.client_secret, lifetime = _a.lifetime, mongo_user = _a.mongo_user, mongo_password = _a.mongo_password;
var MongoClient = require("mongodb").MongoClient;
var app = express_1.default();
var uri_users = "mongodb+srv://" + mongo_user + ":" + mongo_password + "@messengercluster.zgsoy.mongodb.net/userStorage?retryWrites=true&w=majority";
var client_users = new MongoClient(uri_users, { useNewUrlParser: true, useUnifiedTopology: true });
var uri_messages = "mongodb+srv://" + mongo_user + ":" + mongo_password + "@messengercluster.zgsoy.mongodb.net/messagesStorage?retryWrites=true&w=majority";
var client_messages = new MongoClient(uri_messages, { useNewUrlParser: true, useUnifiedTopology: true });
client_users.connect();
client_messages.connect();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.json({ type: "text/*" }));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
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
        .then((function (response) { return response.json(); }))
        .then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
        var user, usersCollection, insertedUser, partResp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = { name: response.login, avatar: response.avatar_url, online: true };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 7, 8]);
                    usersCollection = client_users.db("userStorage").collection("users");
                    return [4 /*yield*/, usersCollection.findOne({ name: user.name })];
                case 2:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, usersCollection.updateOne({ name: user.name }, { $set: { isLogin: true } })];
                case 3:
                    _a.sent();
                    console.debug("User " + user.name + " is login");
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, usersCollection.insertOne(user)];
                case 5:
                    insertedUser = _a.sent();
                    console.debug("User " + insertedUser.name + " save in database");
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    console.debug("In finally block");
                    return [7 /*endfinally*/];
                case 8:
                    partResp = { "login": response.login, "avatar_url": response.avatar_url, "lifetime": lifetime };
                    return [2 /*return*/, res.status(200).json(partResp)];
            }
        });
    }); })
        .catch(function (error) {
        return res.status(400).json(error);
    });
});
app.post("/api/logout", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userName, usersCollection;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userName = req.body.login;
                _a.label = 1;
            case 1:
                _a.trys.push([1, , 6, 7]);
                usersCollection = client_users.db("userStorage").collection("users");
                return [4 /*yield*/, usersCollection.findOne({ name: userName })];
            case 2:
                if (!_a.sent()) return [3 /*break*/, 4];
                return [4 /*yield*/, usersCollection.updateOne({ name: userName }, { $set: { isLogin: false } })];
            case 3:
                _a.sent();
                console.debug("User " + userName + " is logout");
                return [2 /*return*/, res.status(200).json("Success logout")];
            case 4: return [2 /*return*/, res.status(403).json("Forbidden")];
            case 5: return [3 /*break*/, 7];
            case 6:
                console.debug("In finally block");
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); });
app.get("/api/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userName, usersCollection, userData, allUsers, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userName = "Ivan";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, 8, 9]);
                return [4 /*yield*/, client_users.db("userStorage").collection("users")];
            case 2:
                usersCollection = _a.sent();
                return [4 /*yield*/, usersCollection.findOne({ name: userName })];
            case 3:
                userData = _a.sent();
                if (!(userData !== null && userData.login)) return [3 /*break*/, 5];
                return [4 /*yield*/, usersCollection.find({}).toArray()];
            case 4:
                allUsers = _a.sent();
                return [2 /*return*/, res.status(200).json(allUsers.map(function (user) { return user.name; }))];
            case 5:
                if (userData === null) {
                    return [2 /*return*/, res.status(400).json("Incorrect body")];
                }
                else {
                    return [2 /*return*/, res.status(403).json("Forbidden")];
                }
                _a.label = 6;
            case 6: return [3 /*break*/, 9];
            case 7:
                error_1 = _a.sent();
                console.debug(error_1);
                return [2 /*return*/, res.json("Sorry, application is crashed)")];
            case 8:
                console.debug("In finally block");
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}); });
// Получить последние сообщения и аватарки других пользователей
app.post("/api/lastMessages", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUserName, ans, messagesCollection, allMessages, usersCollection, i, fromUser, toUser, fromUserData, toUserData, allUsers, allUsersNames, _loop_1, _i, allUsersNames_1, name_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentUserName = req.body.currentUserName;
                ans = {};
                ans["messages"] = {};
                ans["avatars"] = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 12, 13, 14]);
                return [4 /*yield*/, client_messages.db("messagesStorage").collection("message")];
            case 2:
                messagesCollection = _a.sent();
                return [4 /*yield*/, messagesCollection.find({}).toArray()];
            case 3:
                allMessages = _a.sent();
                return [4 /*yield*/, client_users.db("userStorage").collection("users")];
            case 4:
                usersCollection = _a.sent();
                i = allMessages.length - 1;
                _a.label = 5;
            case 5:
                if (!(i >= 0)) return [3 /*break*/, 10];
                fromUser = allMessages[i].from;
                toUser = allMessages[i].to;
                if (!(fromUser === currentUserName || toUser === currentUserName)) return [3 /*break*/, 9];
                if (!!Object.prototype.hasOwnProperty.call(ans["messages"], fromUser)) return [3 /*break*/, 7];
                ans["messages"][fromUser] = { text: allMessages[i].text, isMy: true, time: allMessages[i].time };
                return [4 /*yield*/, usersCollection.findOne({ name: fromUser })];
            case 6:
                fromUserData = _a.sent();
                ans["avatars"][fromUser] = fromUserData.avatar;
                _a.label = 7;
            case 7:
                if (!!Object.prototype.hasOwnProperty.call(ans["messages"], toUser)) return [3 /*break*/, 9];
                ans["messages"][toUser] = { text: allMessages[i].text, isMy: false, time: allMessages[i].time };
                return [4 /*yield*/, usersCollection.findOne({ name: toUser })];
            case 8:
                toUserData = _a.sent();
                ans["avatars"][toUser] = toUserData.avatar;
                _a.label = 9;
            case 9:
                i--;
                return [3 /*break*/, 5];
            case 10: return [4 /*yield*/, usersCollection.find({}).toArray()];
            case 11:
                allUsers = _a.sent();
                allUsersNames = allUsers.map(function (user) { return user.name; });
                _loop_1 = function (name_1) {
                    if (!Object.prototype.hasOwnProperty.call(ans["messages"], name_1)) {
                        ans["messages"][name_1] = { text: "Начните чат", isMy: true, time: "00.00" };
                        ans["avatars"][name_1] = allUsers.filter(function (user) { return user.name == name_1; })[0].avatar;
                    }
                };
                // если сообщений между пользователями еще не было
                for (_i = 0, allUsersNames_1 = allUsersNames; _i < allUsersNames_1.length; _i++) {
                    name_1 = allUsersNames_1[_i];
                    _loop_1(name_1);
                }
                return [3 /*break*/, 14];
            case 12:
                error_2 = _a.sent();
                console.debug(error_2);
                return [2 /*return*/, res.json("Sorry, application is crashed)")];
            case 13:
                console.debug("In finally block");
                return [7 /*endfinally*/];
            case 14: return [2 /*return*/, res.json(ans)];
        }
    });
}); });
// Получить сообщения между двумя пользователями
app.post("/api/messages", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUserName, interlocutorUserName, messages, messagesCollection, allMessages, i, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentUserName = req.body.currentUserName;
                interlocutorUserName = req.body.interlocutorUserName;
                messages = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 6]);
                return [4 /*yield*/, client_messages.db("messagesStorage").collection("message")];
            case 2:
                messagesCollection = _a.sent();
                return [4 /*yield*/, messagesCollection.find({}).toArray()];
            case 3:
                allMessages = _a.sent();
                for (i = 0; i < allMessages.length; i++) {
                    if (allMessages[i].from === currentUserName && allMessages[i].to === interlocutorUserName)
                        messages.push({ text: allMessages[i].text, isMy: true, time: allMessages[i].time });
                    else if (allMessages[i].from === interlocutorUserName && allMessages[i].to === currentUserName)
                        messages.push({ text: allMessages[i].text, isMy: false, time: allMessages[i].time });
                }
                return [3 /*break*/, 6];
            case 4:
                error_3 = _a.sent();
                console.debug(error_3);
                return [2 /*return*/, res.json("Sorry, application is crashed)")];
            case 5:
                console.debug("In finally block");
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/, res.json({ "messages": messages })];
        }
    });
}); });
// Добавить сообщение {text: string, isMy: bool, time: string} между двумя пользователями
app.post("/api/addMessage", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var message, interlocutorUserName, currentUserName, fromUser, toUser, messagesCollection, messageInformation, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                message = req.body.message;
                interlocutorUserName = req.body.interlocutorUserName;
                currentUserName = req.body.currentUserName;
                if (message.isMy) {
                    fromUser = currentUserName;
                    toUser = interlocutorUserName;
                }
                else {
                    fromUser = interlocutorUserName;
                    toUser = currentUserName;
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 6]);
                return [4 /*yield*/, client_messages.db("messagesStorage").collection("message")];
            case 2:
                messagesCollection = _a.sent();
                messageInformation = { from: fromUser, to: toUser, text: message.text, time: message.time, isMy: message.isMy };
                return [4 /*yield*/, messagesCollection.insertOne(messageInformation)];
            case 3:
                result = _a.sent();
                console.debug(result.insertedCount + " documents with message information were inserted with the _id: " + result.insertedId);
                return [3 /*break*/, 6];
            case 4:
                error_4 = _a.sent();
                console.debug(error_4);
                return [2 /*return*/, res.json("Sorry, application is crashed)")];
            case 5:
                console.debug("In finally block");
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/, res.json({ "status": true })];
        }
    });
}); });
var port = process.env.PORT || 5000;
app.listen(port, function () { return console.log("Listening on http://localhost:" + port + "/api/"); });
