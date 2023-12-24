import { ChatMessageResponse } from '@models/chat/response/ChatMessageResponse';
import { ChatManager } from './ChatManager';
import { IDeleteMessageSignalRPayload, IEditMessageSignalRPayload, IUsersTypingPayload } from './ChatManager.interfaces';

export class ChatHelper {
    static shared = new ChatHelper();

    sendTypingEvent = (userIds: string[], payload: IUsersTypingPayload) => {
        const key = `${payload.objectId}-${payload.objectInstanceId}`;
        if (ChatManager.shared.channelTypingState[key] !== payload.typingState) {
            ChatManager.shared.sendMessageToUsers(userIds, {
                event: 'user-typing',
                sentDeviceUID: ChatManager.shared._deviceUID,
                payload,
            });
            console.info('Send typing event: ', payload);
        }

        ChatManager.shared.channelTypingState[key] = payload.typingState;
    };

    sendNewMessagesEvent = (userIds: string[], payload: ChatMessageResponse) => {
        ChatManager.shared.sendMessageToUsers(userIds, {
            event: 'new-messages',
            payload,
            sentDeviceUID: ChatManager.shared._deviceUID,
        });
    };

    sendEditMessageEvent = (userIds: string[], payload: IEditMessageSignalRPayload) => {
        ChatManager.shared.sendMessageToUsers(userIds, {
            event: 'edit-message',
            payload,
            sentDeviceUID: ChatManager.shared._deviceUID,
        });
        console.info('Send edit message event: ', userIds, payload);
    };

    sendDeleteMessageEvent = (userIds: string[], payload: IDeleteMessageSignalRPayload) => {
        ChatManager.shared.sendMessageToUsers(userIds, {
            event: 'delete-message',
            payload,
            sentDeviceUID: ChatManager.shared._deviceUID,
        });
    };
}
