
export class User {
    name: string;
    avatar: string;
    isLogin: boolean;
    constructor(name: string, avatar: string, isLogin=false) {
    	this.name = name
    	this.avatar = avatar
    	this.isLogin = isLogin
    }
}

export class Users {
    [key: string]: User
}

