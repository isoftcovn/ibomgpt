export default class LoginModel {
    token: string;
    hostApi?: string;
    chathubURI?: string;
    userId: number;
    fullname?: string;
    username: string;

    constructor() {
        this.token = '';
        this.username = '';
        this.userId = 0;
    }

    static parseFromJson = (data: any): LoginModel => {
        const obj = new LoginModel();
        const { token, user_id, hostApi, fullname, username, chathubURI } = data;
        obj.token = token;
        obj.hostApi = hostApi;
        obj.chathubURI = chathubURI;
        obj.userId = user_id;
        obj.fullname = fullname;
        obj.username = username;
        return obj;
    };

}
