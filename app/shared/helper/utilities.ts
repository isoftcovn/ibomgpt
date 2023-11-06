export default class Utilities {
    static delay = (duration = 1000): Promise<any> => {
        return new Promise(((resolve) => {
            setTimeout(() => {
                resolve(null);
            }, duration);
        }));
    };

    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    static getRandomArbitrary = (min: number, max: number): number => {
        return Math.random() * (max - min) + min;
    };

    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     * The value is no lower than min (or the next integer greater than min
     * if min isn't an integer) and no greater than max (or the next integer
     * lower than max if max isn't an integer).
     * Using Math.round() will give you a non-uniform distribution!
     */

    static getRandomInt = (min: number, max: number): number => {
        const _min = Math.ceil(min);
        const _max = Math.floor(max);
        return Math.floor(Math.random() * (_max - _min + 1)) + _min;
    };

    /**
     *
     * @param func
     * @returns {*|boolean}
     */
    static isFunction(func: any) {
        return func && typeof func === 'function';
    }

    /**
     * convert array string to string with comma
     * @param data
     */
    static convertArrayStringToString(data: Array<string>, space: boolean) {
        let text = '';
        const length = data.length;
        if (length > 0) {
            const temp = space ? ', ' : ',';
            for (let i = 0; i <= length - 2; i++) {
                text = text + data[i] + temp;
            }
            text = text + data[length - 1];
        }
        return text;
    }
}
