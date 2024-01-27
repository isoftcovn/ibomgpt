import Notifee, { Notification } from '@notifee/react-native';
import { ChatManager } from 'app/presentation/managers/ChatManager';
import { DeviceEventEmitter, EmitterSubscription } from 'react-native';
import { NotificationWillDisplayEvent } from 'react-native-onesignal';
import { v4 as uuidv4 } from 'uuid';
import { NOTIFICATION_CHANNEL } from '../constants';
import AppManager from '../managers/AppManager';
import NavigationService from './NavigationService';

export interface INotificationHandler {
    onMessage: (message: NotificationWillDisplayEvent) => void;
    onNotificationDisplayed?: (notification: any) => void;
    onNotificationOpened?: (notificationOpen: Notification, isForeground: boolean) => void;
}

export default class DefaultNotificationHandler implements INotificationHandler {
    _subscription?: EmitterSubscription;

    displayedNotifications: Record<string, boolean> = {};

    onMessage = (notification: NotificationWillDisplayEvent) => {
        console.info('Receive notification: ', notification);
        this.displayNotification(notification);
    };

    handleOpenNotification = (notificationOpen: Notification) => {
        const data = notificationOpen.data;
        const customData = (data?.custom ?? {}) as any;
        if (customData.a) {
            // TODO: change the notification data field here
            const payload = customData.a as any;
            const objectId = payload.object_id ? parseInt(`${payload.object_id}`, 10) : undefined;
            const objectInstanceId = payload.object_instance_id ? parseInt(`${payload.object_instance_id}`, 10) : undefined;
            if (objectId && objectInstanceId) {
                const isAlreadyInThisConversation = objectId === ChatManager.shared.currentConversationInfo.objectId &&
                    objectInstanceId === ChatManager.shared.currentConversationInfo.objectInstanceId;
                if (!isAlreadyInThisConversation) {
                    NavigationService.popToTop();
                    NavigationService.navigate('Conversation', {
                        objectId,
                        objectInstanceId
                    });
                }
            }
        }
    };

    onNotificationOpened = (notificationOpen: Notification, isForeground: boolean) => {
        console.info('Opened Notification: ', notificationOpen);
        console.info('isForeground: ', isForeground);


        if (AppManager.appState.credentialsReadyForAuth) {
            this.handleOpenNotification(notificationOpen);
        } else {
            this._subscription = DeviceEventEmitter.addListener('credentialsReadyForAuth', () => {
                console.info('app init success emit');
                this.handleOpenNotification(notificationOpen);
            });
        }
    };

    _shouldDisplayNotification = (event: NotificationWillDisplayEvent): boolean => {
        const notification = event.notification;
        const payload = notification.additionalData as any;
        if (payload) {
            const objectId = payload.object_id ? parseInt(`${payload.object_id}`, 10) : undefined;
            const objectInstanceId = payload.object_instance_id ? parseInt(`${payload.object_instance_id}`, 10) : undefined;

            return objectId !== ChatManager.shared.currentConversationInfo.objectId ||
                objectInstanceId !== ChatManager.shared.currentConversationInfo.objectInstanceId;
        }
        return true;
    };

    displayNotification = async (event: NotificationWillDisplayEvent) => {        
        event.preventDefault();
        const notification = event.notification;
        if (!this._shouldDisplayNotification(event)) {
            return;
        }
        console.info('display notification: ', notification);
        this.displayedNotifications[notification.notificationId] = true;
        notification.display();
        // const payload: any = notification.rawPayload || {};
        // if (notification.body && notification.title && !this.displayedNotifications[notification.notificationId]) {
        //     console.info('display notification: ', notification);
        //     const generatedNotificationId = uuidv4();
        //     this.displayedNotifications[generatedNotificationId] = true;
        //     try {
        //         await Notifee.displayNotification({
        //             id: generatedNotificationId,
        //             body: notification.body,
        //             title: notification.title,
        //             data: {
        //                 custom: payload.custom
        //             },
        //             android: {
        //                 channelId: NOTIFICATION_CHANNEL,
        //             },
        //         });
        //     } catch (error) {
        //         console.warn('Display notification error: ', error);
        //     }
        // }
    };
}
