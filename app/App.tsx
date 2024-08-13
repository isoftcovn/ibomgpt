import {store} from '@redux/store';
import AppManager from '@shared/managers/AppManager';
import React, {useEffect} from 'react';
import {DeviceEventEmitter, LogBox} from 'react-native';
import Config from 'react-native-config';
import {enableScreens} from 'react-native-screens';
import {Provider} from 'react-redux';
import RootContainer from './RootContainer';
import codePush from 'react-native-code-push';
import appsFlyer from 'react-native-appsflyer';
import {AppsflyerDeeplinkManager} from './presentation/managers/AppsflyerDeeplinkManager';
import {AppRouteManager} from './presentation/managers/AppRouteManager';
import {DefaultTheme, MD3Theme, PaperProvider} from 'react-native-paper';
import {theme} from '@theme/index';
import {FontNames} from '@theme/ThemeDefault';

enableScreens();

interface Props {}

LogBox.ignoreAllLogs();

const paperTheme: MD3Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: theme.color.colorPrimary,
        secondary: theme.color.colorSecondary,
        onPrimary: theme.color.onPrimary,
        onSecondary: theme.color.onPrimary,
        background: theme.color.backgroundColorPrimary,
        onBackground: theme.color.onBackground,
    },
    fonts: {
        ...DefaultTheme.fonts,
        default: {
            ...DefaultTheme.fonts.default,
            fontFamily: FontNames.Normal,
        },
    },
};

const App = (props: Props) => {
    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener(
            'credentialsReadyForAuth',
            () => {
                AppManager.appState.credentialsReadyForAuth = true;
                AppRouteManager.shared.executePendingRoute();
            },
        );

        const unauthSubscription = DeviceEventEmitter.addListener(
            'credentialsReadyForUnauth',
            () => {
                AppManager.appState.credentialsReadyForUnauth = true;
                AppRouteManager.shared.executePendingRoute();
            },
        );

        const onDeepLinkCanceller = appsFlyer.onDeepLink(res => {
            if (res?.deepLinkStatus !== 'NOT_FOUND') {
                console.info('Is deferred deeplink: ', res?.isDeferred);
                const appRoute =
                    AppsflyerDeeplinkManager.shared.handleDeeplink(res);
                console.log('appRoute: ', appRoute);
                if (appRoute) {
                    AppRouteManager.shared.handleRoute(appRoute);
                }
                console.info('Received deeplink data: ', res?.data);
            }
        });

        appsFlyer.initSdk(
            {
                devKey: Config.APPSFLYER_DEV_KEY,
                isDebug: __DEV__,
                appId: Config.APPSFLYER_APP_ID,
                onDeepLinkListener: true, //  -->  you must set the onDeepLinkListener to true to get onDeepLink callbacks
                timeToWaitForATTUserAuthorization: 10, // for iOS 14.5
            },
            result => {
                console.info('initialized appsFlyer: ', result);
            },
            error => {
                console.error('initialized appsFlyer error: ', error);
            },
        );

        appsFlyer.setAppInviteOneLinkID(
            AppsflyerDeeplinkManager.shared.getIBomOneLinkTemplateId(),
        );

        return () => {
            subscription.remove();
            unauthSubscription.remove();
            onDeepLinkCanceller();
        };
    });

    console.info('ENV: ', Config.ENV);
    console.info('API_URL: ', Config.API_URL);

    return (
        <Provider store={store}>
            <PaperProvider theme={paperTheme}>
                <RootContainer />
            </PaperProvider>
        </Provider>
    );
};

const codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

const MyApp = codePush(codePushOptions)(App);

export default MyApp;
