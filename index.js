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
import notifee, { EventType } from '@notifee/react-native';
import NotificationHelper from '@shared/helper/NotificationHelper';
import dayjs from 'dayjs';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import Config from 'react-native-config';

// Remove this method to stop OneSignal Debugging
OneSignal.Debug.setLogLevel(LogLevel.Verbose);

// OneSignal Initialization
OneSignal.initialize(Config.ONESIGNAL_APP_ID);

// requestPermission will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission
OneSignal.Notifications.requestPermission(true);

// Method for listening for notification clicks
// OneSignal.Notifications.addEventListener('click', (event) => {
//     console.log('OneSignal: notification clicked:', event);
// });

var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

configureLocalization('vi_VN');

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
