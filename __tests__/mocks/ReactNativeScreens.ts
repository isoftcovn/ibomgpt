import { jest } from '@jest/globals';

jest.mock('react-native-screens', () => {
    return {
        enableScreens: jest.fn()
    }
});

export {};