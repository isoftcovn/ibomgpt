import notifee, { EventType } from '@notifee/react-native';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import AppManager from '@shared/managers/AppManager';
import { DropdownAlert, LoadingIndicator } from 'app/presentation/components';
import ViewConnectionStatus from 'app/presentation/components/globals/view/ViewConnectionStatus';
import { RootStack } from 'app/presentation/navigation';
import AnalyticsHelper from 'app/shared/helper/AnalyticsHelper';
import LoadingManager from 'app/shared/helper/LoadingManager';
import NavigationService from 'app/shared/helper/NavigationService';
import NotificationHelper from 'app/shared/helper/NotificationHelper';
import React, { useCallback, useEffect, useRef } from 'react';
import { AppState, DeviceEventEmitter, EmitterSubscription, Linking, Platform, StatusBar, StyleSheet } from 'react-native';
import Config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RNShake from 'react-native-shake';
import DeeplinkHandler from './presentation/managers/DeeplinkHandler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { OneSignal, PushSubscriptionChangedState } from 'react-native-onesignal';

interface Props {
}

const RootContainer = React.memo((props: Props) => {
    const currentNavigationState = useRef<NavigationState>();
    const deeplinkUrl = useRef<string>();

    const _setPendingDeeplink = useCallback((url: string) => {
        if (DeeplinkHandler.shouldIgnoreDeeplink(url)) { return; }
        deeplinkUrl.current = url;
    }, []);

    const handleLinkParams = useCallback((url: string, saveDeeplink = false) => {
        const consumed = DeeplinkHandler.handleDeeplinkUrl(url);

        if (saveDeeplink && !consumed) {
            _setPendingDeeplink(url);
        }

        if (consumed) {
            deeplinkUrl.current = undefined;
        }
    }, [_setPendingDeeplink]);

    const pushStateChanged = useCallback((subscription: PushSubscriptionChangedState) => {
        console.log('OneSignal: subscription changed:', subscription);
    }, []);

    useEffect(() => {
        OneSignal.User.pushSubscription.addEventListener('change', pushStateChanged);

        return () => {
            OneSignal.User.pushSubscription.removeEventListener('change', pushStateChanged);
        };
    }, [pushStateChanged]);

    // Subscribe deeplinks
    useEffect(() => {
        let authSubscription: EmitterSubscription | undefined;
        let unauthSubscription: EmitterSubscription | undefined;

        Linking.getInitialURL().then((ev) => {
            if (ev) {
                if (AppManager.appState.credentialsReadyForAuth || AppManager.appState.credentialsReadyForUnauth) {
                    handleLinkParams(ev);
                } else {
                    _setPendingDeeplink(ev);
                }
            }
        }).catch(err => {
            console.warn('An error occurred', err);
        });

        // dynamicLinks().getInitialLink().then(link => {
        //     if (link) {
        //         if (AppManager.appState.credentialsReadyForAuth || AppManager.appState.credentialsReadyForUnauth) {
        //             handleLinkParams(link.url);
        //         } else {
        //             _setPendingDeeplink(link.url);
        //         }
        //     }
        // }).catch(err => {
        //     console.warn('An error occurred', err);
        // });

        const linkingSubcription = Linking.addListener('url', (res) => {
            const url = res.url;
            if (url) {
                if (AppManager.appState.credentialsReadyForAuth || AppManager.appState.credentialsReadyForUnauth) {
                    handleLinkParams(url, true);
                } else {
                    _setPendingDeeplink(url);
                }
            }
        });

        // this.dynamicLinksSubscription = dynamicLinks().onLink(link => {
        //     const url = link?.url;
        //     if (url) {
        //         if (AppManager.appState.credentialsReadyForAuth || AppManager.appState.credentialsReadyForUnauth) {
        //             this.handleLinkParams(url);
        //         } else {
        //             this._setPendingDeeplink(url);
        //         }
        //     }
        // });

        if (!AppManager.appState.credentialsReadyForAuth && !AppManager.appState.credentialsReadyForUnauth) {
            authSubscription = DeviceEventEmitter.addListener('credentialsReadyForAuth', () => {
                if (deeplinkUrl.current) {
                    handleLinkParams(deeplinkUrl.current);
                }
            });
            unauthSubscription = DeviceEventEmitter.addListener('credentialsReadyForUnauth', () => {
                if (deeplinkUrl.current) {
                    handleLinkParams(deeplinkUrl.current);
                }
            });
        }

        return () => {
            linkingSubcription.remove();
            authSubscription?.remove();
            unauthSubscription?.remove();
        };
    }, [handleLinkParams, _setPendingDeeplink]);

    // Subscribe shake event
    useEffect(() => {
        const shakeSubscription = RNShake.addListener(() => {
            if (Config.ENABLE_DEVELOPER_CONSOLE == 'true') {
                NavigationService.navigate('DeveloperConsole');
            }
        });

        NotificationHelper.listenOnNotification(NotificationHelper.notificationHandler);

        return () => {
            shakeSubscription.remove();
            NotificationHelper.detachListeners();
        };
    }, []);

    // Subscribe appstate
    useEffect(() => {
        const appstateSubscription = AppState.addEventListener('change', nextAppState => {
            if (
                AppManager.appStateStatus.value.match(/background/) &&
                nextAppState === 'active'
            ) {
                AppManager.appFromBackgroundToForeground.next(new Date());
                console.info('App has come to the foreground!');
            }

            if (
                AppManager.appStateStatus.value.match(/active/) &&
                (nextAppState === 'inactive' || nextAppState === 'background')
            ) {
                AppManager.appFromForegroundToBackground.next(new Date());
                console.info('App has come to the background!');
            }

            AppManager.appStateStatus.next(nextAppState);
        });

        return () => {
            appstateSubscription.remove();
        };
    }, []);

    // Subscribe to events
    useEffect(() => {
        return notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
                case EventType.DISMISSED:
                    console.info('User dismissed notification', detail.notification);
                    break;
                case EventType.PRESS:
                    console.info('User pressed notification', detail.notification);
                    if (detail.notification) {
                        NotificationHelper.notificationHandler.onNotificationOpened?.(detail.notification, true);
                    }
                    break;
            }
        });
    }, []);

    const getActiveRouteName = useCallback((
        navigationState: NavigationState | undefined
    ): string | undefined => {
        if (!navigationState) {
            return '';
        }
        const route = navigationState.routes[navigationState.index];
        return route.name;
    }, []);

    const onNavigationStateChange = useCallback((navigationState: NavigationState | undefined) => {
        if (navigationState) {
            const previousNavigationState = currentNavigationState.current;
            currentNavigationState.current = navigationState;
            const previousRouteName = getActiveRouteName(previousNavigationState);
            const currentRouteName = getActiveRouteName(navigationState);

            if (currentRouteName && previousRouteName !== currentRouteName) {
                AnalyticsHelper.setCurrentScreen(
                    currentRouteName,
                    currentRouteName
                );
                if (!__DEV__) {
                    AnalyticsHelper.logEvent('navigation_change', {
                        from: previousRouteName,
                        to: currentRouteName,
                    });
                }
            }
        }
    }, [getActiveRouteName]);

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaProvider>
                <ActionSheetProvider>
                    <NavigationContainer
                        ref={(ref: any) =>
                            NavigationService.setTopLevelNavigator(ref)
                        }
                        onStateChange={onNavigationStateChange}
                    >
                        <StatusBar barStyle={Platform.select({
                            android: 'light-content',
                            ios: 'dark-content',
                        })} />
                        <RootStack />
                        <DropdownAlert />
                        <ViewConnectionStatus />
                        <LoadingIndicator
                            ref={(ref: LoadingIndicator) =>
                                LoadingManager.setLoadingRef(ref)
                            }
                        />
                    </NavigationContainer>
                </ActionSheetProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default RootContainer;
