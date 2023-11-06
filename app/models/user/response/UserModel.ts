
export default class UserModel {
    id: number;
    email?: string;
    firstName?: string;
    lastName?: string;

    constructor() {
        this.id = 0;
    }

    static parseFromJson = (data: any): UserModel => {
        const obj = new UserModel();
        const { first_name, last_name, email, id } = data;

        obj.id = id;
        obj.email = email;
        obj.firstName = first_name;
        obj.lastName = last_name;

        return obj;
    };
}
