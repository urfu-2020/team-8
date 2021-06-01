"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = exports.User = void 0;
var User = /** @class */ (function () {
    function User(name, avatar, isLogin) {
        if (isLogin === void 0) { isLogin = false; }
        this.name = name;
        this.avatar = avatar;
        this.isLogin = isLogin;
    }
    return User;
}());
exports.User = User;
var Users = /** @class */ (function () {
    function Users() {
    }
    return Users;
}());
exports.Users = Users;
