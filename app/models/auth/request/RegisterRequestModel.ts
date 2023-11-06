export default class RegisterRequestModel {
    user_email: string;
    user_pass: string;
    user_name: string;
    user_phone: string;

    constructor(email: string, password: string, name: string, phone: string) {
        this.user_email = email;
        this.user_pass = password;
        this.user_name = name;
        this.user_phone = phone;
    }
}
