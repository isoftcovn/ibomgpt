export default class LoginRequestModel {
    username: string;
    password: string;
    useragent: string;
    uid: string;
    app_type: number;

    constructor(username: string, password: string, useragent: string, uid: string) {
        this.username = username;
        this.password = password;
        this.useragent = useragent;
        this.uid = uid;
        this.app_type = 1;
    }
}
