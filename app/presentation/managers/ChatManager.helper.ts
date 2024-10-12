import GeneratedImages from '@assets/GeneratedImages';
import { ChatMessageResponse } from '@models/chat/response/ChatMessageResponse';
import { ReactionModel } from 'app/presentation/models/ReactionModel';
import { ContextMenuActionButtonModel } from '@modules/conversation/components/ContextMenuModal.model';
import { theme } from '@theme/index';
import { TFunction, use } from 'i18next';
import { ChatManager } from './ChatManager';
import {
    DeleteMessageSignalRPayload,
    EditMessageSignalRPayload,
    UsersTypingPayload,
} from './ChatManager.interfaces';
import EmojiManager from './EmojiManager';
import { IUpdateMessageReactionPayload } from '@redux/actions/conversation';

export class ChatHelper {
    static shared = new ChatHelper();

    sendTypingEvent = (userIds: string[], payload: UsersTypingPayload) => {
        const key = `${payload.objectId}-${payload.objectInstanceId}`;
        if (
            ChatManager.shared.channelTypingState[key] !== payload.typingState
        ) {
            ChatManager.shared.sendMessageToUsers(userIds, {
                event: 'user-typing',
                sentDeviceUID: ChatManager.shared._deviceUID,
                payload,
            });
            console.info('Send typing event: ', payload);
        }

        ChatManager.shared.channelTypingState[key] = payload.typingState;
    };

    sendNewMessagesEvent = (
        userIds: string[],
        payload: ChatMessageResponse,
    ) => {
        ChatManager.shared.sendMessageToUsers(userIds, {
            event: 'new-messages',
            payload,
            sentDeviceUID: ChatManager.shared._deviceUID,
        });
    };

    sendEditMessageEvent = (
        userIds: string[],
        payload: EditMessageSignalRPayload,
    ) => {
        ChatManager.shared.sendMessageToUsers(userIds, {
            event: 'edit-message',
            payload,
            sentDeviceUID: ChatManager.shared._deviceUID,
        });
        console.info('Send edit message event: ', userIds, payload);
    };

    sendDeleteMessageEvent = (
        userIds: string[],
        payload: DeleteMessageSignalRPayload,
    ) => {
        ChatManager.shared.sendMessageToUsers(userIds, {
            event: 'delete-message',
            payload,
            sentDeviceUID: ChatManager.shared._deviceUID,
        });
    };

    sendReactionEvent = (userIds: string[], payload: IUpdateMessageReactionPayload) => {
        ChatManager.shared.sendMessageToUsers(userIds, {
            event: 'reaction',
            payload,
            sentDeviceUID: ChatManager.shared._deviceUID,
        });
    };

    mapReactionIdToEmoji = (reactionId: string): string => {
        return (
            EmojiManager.getInstance().getEmoji(
                reactionId.replaceAll('emoji:', ''),
            ) ?? ''
        ); // emoji:smile -> 😊
    };

    getReactions = (): ReactionModel[] => {
        return [
            new ReactionModel(
                'emoji:thumbs_up',
                this.mapReactionIdToEmoji('emoji:thumbs_up'),
            ),
            new ReactionModel(
                'emoji:heart',
                this.mapReactionIdToEmoji('emoji:heart'),
            ),
            new ReactionModel(
                'emoji:laugh',
                this.mapReactionIdToEmoji('emoji:laugh'),
            ),
            new ReactionModel(
                'emoji:suprised',
                this.mapReactionIdToEmoji('emoji:suprised'),
            ),
            new ReactionModel(
                'emoji:cry',
                this.mapReactionIdToEmoji('emoji:cry'),
            ),
            new ReactionModel(
                'emoji:angry',
                this.mapReactionIdToEmoji('emoji:angry'),
            ),
        ];
    };

    getActionButtons = (t: TFunction): ContextMenuActionButtonModel[] => {
        return [
            new ContextMenuActionButtonModel(
                'reply',
                t('reply'),
                GeneratedImages.icon_reply,
                theme.color.colorSecondary,
            ),
            new ContextMenuActionButtonModel(
                'edit',
                t('edit'),
                GeneratedImages.icon_edit,
                theme.color.colorPrimary,
            ),
            new ContextMenuActionButtonModel(
                'copy',
                t('copy'),
                GeneratedImages.icon_copy,
                theme.color.colorPrimary,
            ),
            new ContextMenuActionButtonModel(
                'delete',
                t('delete'),
                GeneratedImages.icon_trash,
                theme.color.danger,
            ),
        ];
    };
}
