import {ChatListRequestModel} from '@models/chat/request/ChatListRequestModel';
import {ChatMessagesRequestModel} from '@models/chat/request/ChatMessagesRequestModel';
import {ReactionRequestModel} from '@models/chat/request/ReactionRequestModel';
import {ChatItemResponse} from '@models/chat/response/ChatItemResponse';
import UserModel from '@models/user/response/UserModel';
import {IAppChatMessage} from 'app/presentation/models/chat';
import {createActionTypes} from '../helper';

const DOMAIN = 'conversation';

export interface IDeleteMessagePayload {
    objectId: number;
    objectInstanceId: number;
    messageId: string;
}

export interface IEditMessagesPayload {
    objectId: number;
    objectInstanceId: number;
    messages: IAppChatMessage[];
}

export interface IUpdateLocalMessageIdsPayload {
    objectId: number;
    objectInstanceId: number;
    messageIdsToReplace: Record<string, string>;
}

export interface IMarkReadConversationPayload {
    objectId: number;
    objectInstanceId: number;
}

export interface IUpdateMessageReactionPayload {
    reactionData: {
        messageId: number | string;
        reaction: string;
        objectId: number;
        objectInstanceId: number;
    };
    user: UserModel;
    actType: 'add' | 'remove';
}

export const getMessagesType = 'get_messages';
export const getMessagesActionTypes = createActionTypes<
    ChatMessagesRequestModel,
    IAppChatMessage[]
>(getMessagesType, DOMAIN);

export const sendMessagesType = 'send_messages';
export const sendMessagesActionTypes = createActionTypes<
    IAppChatMessage[],
    void
>(sendMessagesType, DOMAIN);

export const editMessagesType = 'edit_messages';
export const editMessagesActionTypes = createActionTypes<
    IEditMessagesPayload,
    void
>(editMessagesType, DOMAIN);

export const deleteMessageType = 'delete_message';
export const deleteMessageActionTypes = createActionTypes<
    IDeleteMessagePayload,
    void
>(deleteMessageType, DOMAIN);

export const deleteMessageRealtimeType = 'delete_message_realtime';
export const deleteMessageRealtimeActionTypes = createActionTypes<
    IDeleteMessagePayload,
    void
>(deleteMessageRealtimeType, DOMAIN);

export const updateLocalMessageIdsType = 'update_local_message_ids';
export const updateLocalMessageIdsActionTypes = createActionTypes<
    IUpdateLocalMessageIdsPayload,
    void
>(updateLocalMessageIdsType, DOMAIN);

export const receiveNewMessagesType = 'receive_new_messages';
export const receiveNewMessagesActionTypes = createActionTypes<
    IAppChatMessage[],
    void
>(receiveNewMessagesType, DOMAIN);

export const updateConversationParticipantsType = 'update_participants';
export const updateConversationParticipantsActionTypes = createActionTypes<
    UserModel[],
    void
>(updateConversationParticipantsType, DOMAIN);

export const getConversationsType = 'get_conversations';
export const getConversationsActionTypes = createActionTypes<
    ChatListRequestModel,
    ChatItemResponse[]
>(getConversationsType, DOMAIN);

export const updateUnreadConversation = 'unread_conversation';
export const updateUnreadConversationActionTypes = createActionTypes<
    IMarkReadConversationPayload,
    void
>(updateUnreadConversation, DOMAIN);

export const updateReadConversation = 'read_conversation';
export const updateReadConversationActionTypes = createActionTypes<
    IMarkReadConversationPayload,
    void
>(updateReadConversation, DOMAIN);

export const updateMessageReactionType = 'update_message_reaction';
export const updateMessageReactionActionTypes = createActionTypes<
    IUpdateMessageReactionPayload,
    void
>(updateMessageReactionType, DOMAIN);
