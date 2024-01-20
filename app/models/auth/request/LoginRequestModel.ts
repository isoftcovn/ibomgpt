export default class LoginRequestModel {
    username: string;
    password: string;
    useragent: string;
    uid: string;

    constructor(username: string, password: string, useragent: string, uid: string) {
        this.username = username;
        this.password = password;
        this.useragent = useragent;
        this.uid = uid;
    }
}
