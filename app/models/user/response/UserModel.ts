
export default class UserModel {
    id: number;
    email?: string;
    fullname?: string;
    avatar?: string;

    constructor() {
        this.id = 0;
    }

    static parseFromJson = (data: any): UserModel => {
        const obj = new UserModel();
        const { email, id, fullname } = data;

        obj.id = id;
        obj.email = email;
        obj.fullname = fullname;

        return obj;
    };

    static parseFromChatResponse = (data: any): UserModel => {
        const obj = new UserModel();
        const { email, user_id } = data;

        obj.id = user_id;
        obj.email = email;

        return obj;
    };
}
