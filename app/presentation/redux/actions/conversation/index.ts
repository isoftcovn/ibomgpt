import { ChatMessagesRequestModel } from '@models/chat/request/ChatMessagesRequestModel';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { createActionTypes } from '../helper';

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

export const getMessagesType = 'get_messages';
export const getMessagesActionTypes = createActionTypes<ChatMessagesRequestModel, IAppChatMessage[]>(getMessagesType, DOMAIN);

export const sendMessagesType = 'send_messages';
export const sendMessagesActionTypes = createActionTypes<IAppChatMessage[], void>(sendMessagesType, DOMAIN);

export const editMessagesType = 'edit_messages';
export const editMessagesActionTypes = createActionTypes<IEditMessagesPayload, void>(editMessagesType, DOMAIN);

export const deleteMessageType = 'delete_message';
export const deleteMessageActionTypes = createActionTypes<IDeleteMessagePayload, void>(deleteMessageType, DOMAIN);
