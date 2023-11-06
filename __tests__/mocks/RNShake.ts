import { jest } from '@jest/globals';

jest.mock('react-native-shake', () => {
    return () => ({
        addListener: jest.fn(),
        removeAllListeners: jest.fn()
    })
});

export {};