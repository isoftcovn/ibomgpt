import DefaultNotificationHandler, { INotificationHandler } from 'app/shared/helper/NotificationHandler';
import Notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import { NotificationWillDisplayEvent, OneSignal } from 'react-native-onesignal';
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
        // this.createDefaultChannel();
    }

    hasPermission = async () => {
        const settings = await Notifee.getNotificationSettings();
        return settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
            settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;
    };

    createDefaultChannel = async () => {
        const exists = await Notifee.isChannelCreated(NOTIFICATION_CHANNEL);
        if (exists) {
            return;
        }
        const channelId = await Notifee.createChannel({
            id: NOTIFICATION_CHANNEL,
            name: NOTIFICATION_CHANNEL,
            importance: AndroidImportance.HIGH
        });
        console.info(`Created channel ${NOTIFICATION_CHANNEL}: `, channelId);
    };

    askPermissionAndRegisterDeviceToken = async (permissionCallback: IPermissionCallback, deviceTokenCallBack: IDeviceTokenCallback) => {
        try {
            // requestPermission will show the native iOS or Android notification permission prompt.
            // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
            // const enabled = await OneSignal.Notifications.requestPermission(false);
            const settings = await Notifee.requestPermission({
                alert: true,
                badge: true,
                sound: true,
            });
            const enabled =
                settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
                settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;
            if (permissionCallback) {
                permissionCallback.onPermission(enabled);
            }

            if (enabled) {
                const pushToken = OneSignal.User.pushSubscription.getPushSubscriptionToken();
                console.info('pushToken: ', pushToken);
                if (pushToken && deviceTokenCallBack) {
                    // user has a device token
                    deviceTokenCallBack.onDeviceTokenReceived(pushToken);
                }
            }
        } catch (error) {
            if (permissionCallback) {
                permissionCallback.onPermission(false);
            }
        }
    };

    // registerUserTopic = async (userId: string) => {
    //     const settings = await Notifee.getNotificationSettings();
    //     const granted =
    //         settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    //         settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;
    //     if (granted) {
    //         messaging().subscribeToTopic(userId).then(() => {
    //             console.info('subscribe to topic: ', userId);
    //         }).catch(error => {
    //             console.warn('subscribe topic error: ', error);
    //         });
    //     }
    // };

    // unregisterUserTopic = (userId: string) => {
    //     messaging().unsubscribeFromTopic(userId).then(() => console.info('unsubscribe topic: ', userId)).catch(console.warn);
    // };

    onForegroundWillDisplay = (event: NotificationWillDisplayEvent) => {
        this.notificationHandler.onMessage(event);
    };

    listenOnNotification = async (notificationHandler: INotificationHandler) => {
        try {
            const granted = await this.hasPermission();
            if (granted) {
                // user has permissions
                OneSignal.Notifications.removeEventListener('foregroundWillDisplay', this.onForegroundWillDisplay);
                OneSignal.Notifications.addEventListener('foregroundWillDisplay', this.onForegroundWillDisplay);
                // this.onMessageListener = messaging().onMessage((notification: FirebaseMessagingTypes.RemoteMessage) => {
                //     // Process your notification as required
                //     console.info('receive remote notification: ', notification);
                //     notificationHandler.onMessage(notification);
                // });
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
