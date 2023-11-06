/* eslint-disable @typescript-eslint/no-var-requires */
require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();
import {NativeModules} from 'react-native';

NativeModules.BlobModule = {
    ...NativeModules.BlobModule,
    addNetworkingHandler: jest.fn(),
};
NativeModules.BuildConfig = {
    buildENV: 'dev'
}

jest.setTimeout(30000);
