import Notifee, { Notification } from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { DeviceEventEmitter, EmitterSubscription } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { NOTIFICATION_CHANNEL } from '../constants';
import AppManager from '../managers/AppManager';

export interface INotificationHandler {
    onMessage: (message: FirebaseMessagingTypes.RemoteMessage) => void;
    onNotificationDisplayed?: (notification: any) => void;
    onNotificationOpened?: (notificationOpen: Notification, isForeground: boolean) => void;
}

export default class DefaultNotificationHandler implements INotificationHandler {
    _subscription?: EmitterSubscription;

    onMessage = (notification: FirebaseMessagingTypes.RemoteMessage) => {
        this.displayNotification(notification);
    };

    handleOpenNotification = (notificationOpen: Notification) => {
        const data = notificationOpen.data;
        if (data) {
            // TODO: change the notification data field here
            const action = data.action;
            if (!action) {
                return;
            }
        }
    };

    onNotificationOpened = (notificationOpen: Notification, isForeground: boolean) => {
        console.info('Opened Notification: ', notificationOpen);
        console.info('isForeground: ', isForeground);


        /**
         * Using emitter when open notif from background
         * Wait until all setup steps are done
         */
        if (!isForeground) {
            this._subscription?.remove();

            if (AppManager.appState.credentialsReadyForAuth) {
                this.handleOpenNotification(notificationOpen);
            } else {
                this._subscription = DeviceEventEmitter.addListener('credentialsReadyForAuth', () => {
                    console.info('app init success emit');
                    this.handleOpenNotification(notificationOpen);
                });
            }
        } else {
            this.handleOpenNotification(notificationOpen);
        }
    };

    displayNotification = async (notification: FirebaseMessagingTypes.RemoteMessage) => {
        const payload = notification.data || {};
        const notificationContent = notification.notification || {};
        if (notificationContent && notificationContent.body && notificationContent.title) {
            await Notifee.displayNotification({
                id: uuidv4(),
                body: notificationContent.body,
                title: notificationContent.title,
                data: payload,
                android: {
                    channelId: NOTIFICATION_CHANNEL,
                },
            });
        }
    };
}
