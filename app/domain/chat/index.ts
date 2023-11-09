import { ChatListRequestModel } from '@models/chat/request/ChatListRequestModel';
import { ChatMessagesRequestModel } from '@models/chat/request/ChatMessagesRequestModel';
import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';
import { ChatMessageResponse } from '@models/chat/response/ChatMessageResponse';

export interface IChatRepository {
    getChatList: (body: ChatListRequestModel) => Promise<ChatItemResponse[]>;
    getChatMessages: (body: ChatMessagesRequestModel) => Promise<ChatMessageResponse[]>;
}
