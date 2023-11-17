import { ChatMessagesRequestModel } from '@models/chat/request/ChatMessagesRequestModel';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { createActionTypes } from '../helper';

const DOMAIN = 'conversation';

export const getMessagesType = 'get_messages';
export const getMessagesActionTypes = createActionTypes<ChatMessagesRequestModel, IAppChatMessage[]>(getMessagesType, DOMAIN);

export const sendMessagesType = 'send_messages';
export const sendMessagesActionTypes = createActionTypes<IAppChatMessage[], void>(sendMessagesType, DOMAIN);
