declare module 'react-native-config' {
    export type BuildEnv = 'uat' | 'production' | 'dev';

    export interface NativeConfig {
        API_URL: string;
        APP_NAME: string;
        ENABLE_DEVELOPER_CONSOLE: string;
        ENABLE_NETWORK_DEBUGGER: string;
        ENV: BuildEnv;
        DYNAMIC_LINK_URL: string;
        DEEPLINK_SCHEME: string;
        ONESIGNAL_APP_ID: string;
        SIGNALR_URL: string;
    }

    export const Config: NativeConfig;
    export default Config;
}