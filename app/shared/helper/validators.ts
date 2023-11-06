export default class Validators {
    static PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{2,6}$/im;
    static EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    static PASSWORD_REGEX = /^(?=.{8,})((?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])|(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])).*/;
    static NAME_REGEX = /(\w.+\s).+/i;

    static isEmailValid(email: string): boolean {
        const reg = Validators.EMAIL_REGEX;
        return reg.test(email);
    }

    static isPhoneValid(inputtxt: string): boolean {
        const phoneno = Validators.PHONE_REGEX;
        return phoneno.test(inputtxt);
    }

    static isPasswordValid(pass: string): boolean {
        const regex = Validators.PASSWORD_REGEX;
        return regex.test(pass);
    }

    static isLengthRangeValid(text: string, minLength: number, maxLength: number) {
        if (minLength && maxLength) {
            return text && text.length >= minLength && text.length <= maxLength;
        }
        if (minLength) {
            return text && text.length >= minLength;
        }
        if (maxLength) {
            return text && text.length <= maxLength;
        }
        return false;
    }

    static isRequired(text: string): boolean {
        if (text) {
            if (typeof text === 'string') {
                return text.trim().length > 0;
            }
            return true;
        }
        return false;
    }

    static isNumberOnly(text: string): boolean {
        const regex = /\D/g;
        return !regex.test(text);
    }
}
