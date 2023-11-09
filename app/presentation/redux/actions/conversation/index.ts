import { IAppChatMessage } from 'app/presentation/models/chat';
import { createActionTypes } from '../helper';
import { ChatMessagesRequestModel } from '@models/chat/request/ChatMessagesRequestModel';

const DOMAIN = 'conversation';

export const getMessagesType = 'get_messages';
export const getMessagesActionTypes = createActionTypes<ChatMessagesRequestModel, IAppChatMessage[]>(getMessagesType, DOMAIN);
