import { jest } from '@jest/globals';

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
    return {
        getEnforcing: jest.fn(),
        get: jest.fn()
    }
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
    return require('react-native/Libraries/EventEmitter/__mocks__/NativeEventEmitter');
});

jest.doMock('react-native/Libraries/Utilities/Dimensions', () => ({
    get: jest.fn().mockReturnValue({width: 100, height: 100})
}));

jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
    isPad: false,
    isTVOS: false,
    OS: 'ios'
}));

jest.mock('react-native-device-info', () => {
    return require('react-native-device-info/jest/react-native-device-info-mock');
});

jest.mock('react-native-encrypted-storage', () => {
    return {
        setItem: () => Promise.resolve(),
        getItem: () => Promise.resolve(),
        removeItem: () => Promise.resolve(),
        clear: () => Promise.resolve(),
    }
});

export {};