import { jest } from '@jest/globals';

jest.mock('@react-native-firebase/app', () => {
    return () => ({

    });
});

jest.mock('@react-native-firebase/analytics', () => {
    return () => ({
        logEvent: () => Promise.resolve(),
        setUserProperties: () => Promise.resolve(),
        setUserId: () => Promise.resolve(),
        setCurrentScreen: () => Promise.resolve(),
        setAnalyticsCollectionEnabled: () => Promise.resolve()
    })
});

jest.mock('@react-native-firebase/crashlytics', () => {
    return () => ({
        recordError: () => Promise.resolve(),
        log: () => Promise.resolve(),
        setUserId: () => Promise.resolve(),
        setAttributes: () => Promise.resolve(),
    })
});

jest.mock('@react-native-firebase/perf', () => {
    return () => ({
        setPerformanceCollectionEnabled: () => Promise.resolve(),
        newHttpMetric: () => {
            return {
                setHttpResponseCode: jest.fn(),
                setResponseContentType: jest.fn(),
                stop: () => Promise.resolve(),
                start: () => Promise.resolve()
            }
        }
    })
});

jest.mock('@react-native-firebase/messaging', () => {
    return () => ({

    })
});

export {};