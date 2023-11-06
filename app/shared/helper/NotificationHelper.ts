import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import DefaultNotificationHandler, { INotificationHandler } from 'app/shared/helper/NotificationHandler';
import Notifee from '@notifee/react-native';
import { NOTIFICATION_CHANNEL } from '../constants';

export interface IPermissionCallback {
    onPermission: (granted: boolean) => void;
}

export interface IDeviceTokenCallback {
    onDeviceTokenReceived: (deviceToken: string) => void;
}

class NotificationHelper {
    notificationHandler: INotificationHandler;
    private onMessageListener?: any;

    constructor() {
        this.notificationHandler = new DefaultNotificationHandler();
        this.createDefaultChannel();
    }

    createDefaultChannel = async () => {
        const exists = await Notifee.isChannelCreated(NOTIFICATION_CHANNEL);
        if (exists) {
            return;
        }
        const channelId = await Notifee.createChannel({
            id: NOTIFICATION_CHANNEL,
            name: NOTIFICATION_CHANNEL,
        });
        console.info(`Created channel ${NOTIFICATION_CHANNEL}: `, channelId);
    };

    askPermissionAndRegisterDeviceToken = async (permissionCallback: IPermissionCallback, deviceTokenCallBack: IDeviceTokenCallback) => {
        try {
            const granted = await messaging().requestPermission();
            const enabled =
                granted === messaging.AuthorizationStatus.AUTHORIZED ||
                granted === messaging.AuthorizationStatus.PROVISIONAL;
            if (permissionCallback) {
                permissionCallback.onPermission(enabled);
            }

            if (enabled) {
                const fcmToken = await messaging().getToken();
                if (fcmToken && deviceTokenCallBack) {
                    // user has a device token
                    deviceTokenCallBack.onDeviceTokenReceived(fcmToken);
                }
            }
        } catch (error) {
            if (permissionCallback) {
                permissionCallback.onPermission(false);
            }
        }
    };

    registerUserTopic = async (userId: string) => {
        const granted = await messaging().hasPermission();
        if (granted) {
            messaging().subscribeToTopic(userId).then(() => {
                console.info('subscribe to topic: ', userId);
            }).catch(error => {
                console.warn('subscribe topic error: ', error);
            });
        }
    };

    unregisterUserTopic = (userId: string) => {
        messaging().unsubscribeFromTopic(userId).then(() => console.info('unsubscribe topic: ', userId)).catch(console.warn);
    };

    listenOnNotification = async (notificationHandler: INotificationHandler) => {
        try {
            const granted = await messaging().hasPermission();
            if (granted) {
                // user has permissions
                if (this.onMessageListener) {
                    this.onMessageListener.remove();
                }

                this.onMessageListener = messaging().onMessage((notification: FirebaseMessagingTypes.RemoteMessage) => {
                    // Process your notification as required
                    console.info('receive remote notification: ', notification);
                    notificationHandler.onMessage(notification);
                });
            }
        } catch (error) {

        }
    };

    detachListeners = () => {
        if (this.onMessageListener) {
            this.onMessageListener();
        }
    };
}

export default new NotificationHelper();
