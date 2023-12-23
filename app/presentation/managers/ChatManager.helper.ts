import { ChatManager } from './ChatManager';
import { IUsersTypingPayload } from './ChatManager.interfaces';

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
}
