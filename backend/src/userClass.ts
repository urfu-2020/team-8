
export class User {
    name: string;
    avatar: string;
    isLogin: boolean;
    constructor(name: string, avatar: string, isLogin=false) {
        this.name = name;
        this.avatar = avatar;
        this.isLogin = isLogin
    }

    toMongoDocument() {
        return {
            name: this.name,
            avatar: this.avatar,
            isLogin: this.isLogin
        };
    }
}

export class Users {

}
