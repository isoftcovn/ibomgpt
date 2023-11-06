module.exports = {
    preset: 'react-native',
    roots: [
        '<rootDir>/app',
        '<rootDir>/__tests__'
    ],
    setupFiles: [
        './jest.setup.js'
    ],
    setupFilesAfterEnv: [
        './__tests__/mocks/AsyncStorage.ts',
        './__tests__/mocks/Firebase.ts',
        './__tests__/mocks/RNShake.ts',
        './__tests__/mocks/ReactNativeScreens.ts',
        './__tests__/mocks/ReactNative.ts'
    ],
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx'
    ],
    moduleNameMapper: {
        'app/(.*)': '<rootDir>/app/$1'
    },
    transformIgnorePatterns: [
        'node_modules/(?!react-native|@react-native-firebase)/'
    ],
    testPathIgnorePatterns: [
        '\\.snap$',
        '<rootDir>/node_modules/',
        '<rootDir>/__tests__/config/',
        '<rootDir>/__tests__/mocks/'
    ],
    cacheDirectory: '.jest/cache'
};
