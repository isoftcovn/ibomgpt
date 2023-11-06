interface IConstructorData {
    firstName?: string;
    lastName?: string;
    age?: number;
    gender?: string;
}

export default class UpdateProfileRequestModel {
    first_name?: string;
    last_name?: string;
    gender?: string;
    age?: number;

    constructor(data?: IConstructorData) {
        if (data) {
            const {firstName, lastName, gender, age} = data;
            this.first_name = firstName;
            this.last_name = lastName;
            this.gender = gender;
            this.age = age;
        }
    }
}
