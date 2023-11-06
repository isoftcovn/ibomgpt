/*
 * Copyright (c) 9/24/19, 10:12 AM
 * Created by: tmhoang1904@gmail.com
 * Last Modified: 9/24/19, 10:12 AM
 *
 */

export default class CountryModel {
    countryCode: string;
    dialingCode?: string;
    name: string;

    constructor(countryCode: string, name: string) {
        this.countryCode = countryCode;
        this.name = name;
    }

    static parseFromJson = (data: any): CountryModel => {
        const { id, dialling_code, full_name_english } = data;
        const obj = new CountryModel(id, full_name_english);
        obj.dialingCode = dialling_code;

        return obj;
    };
}
