
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
        const { email, id } = data;

        obj.id = id;
        obj.email = email;

        return obj;
    };
}
