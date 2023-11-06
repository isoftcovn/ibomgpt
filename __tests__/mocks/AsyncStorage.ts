import { jest } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () => {
    const caches: any = {};
    return {
        setItem: jest.fn((key, value) => {
            return new Promise<void>((resolve, reject) => {
                caches[key] = value;
                resolve();
            });
        }),
        getItem: jest.fn((key) => {
            return Promise.resolve(caches[key]);
        }),
        removeItem: jest.fn((key) => {
            return new Promise<void>((resolve, reject) => {
                delete caches[key];
                resolve();
            });
        }),
        getAllKeys: jest.fn(() => {
            return Promise.resolve(Object.keys(caches));
        })
    };
});

export { };