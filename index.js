/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { name as appName } from './app.json';
// import messaging from '@react-native-firebase/messaging';
import App from './app/App';
import { configureLocalization } from './app/presentation/localization';
import notifee, {EventType} from '@notifee/react-native';
import NotificationHelper from '@shared/helper/NotificationHelper';

configureLocalization('en');

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, } = detail;

    if (type === EventType.PRESS && notification) {
        NotificationHelper.notificationHandler.onNotificationOpened?.(notification, false);

        // Remove the notification
        await notifee.cancelNotification(notification.id);
    }
});

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }

    return <App />;
}


AppRegistry.registerComponent(appName, () => HeadlessCheck);
