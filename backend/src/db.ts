
export class User {
    name: string;
    avatar: string;
    isLogin: boolean;
    constructor(name: string, avatar: string, isLogin=false) {
        this.name = name;
        this.avatar = avatar;
        this.isLogin = isLogin
    }
}

export class DB2 {
    users:Array<User>;

    constructor() {
        this.users = []
    }
    
    add(user) {
        this.users.push(user)
        console.log(this.users)
    }
}

export class Users {

}

