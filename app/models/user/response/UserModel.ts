
export default class UserModel {
    id: number;
    email?: string;
    fullname?: string;
    avatar?: string;
    position?: string;
    department?: string;
    code?: string;

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
        const { email, user_id, full_name, pos_name, dep_name, user_no } = data;

        obj.id = user_id;
        obj.email = email;
        obj.fullname = full_name;
        obj.position = pos_name;
        obj.department = dep_name;
        obj.code = user_no;

        return obj;
    };
}
