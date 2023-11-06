export default class LoginModel {
    token: string;
    refreshToken?: string;

    constructor() {
        this.token = '';
    }

    static parseFromJson = (data: any): LoginModel => {
        const obj = new LoginModel();
        const { accessToken, refreshToken } = data;
        obj.token = accessToken;
        obj.refreshToken = refreshToken;
        return obj;
    };

}
