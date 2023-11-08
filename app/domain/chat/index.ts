import { ChatListRequestModel } from '@models/chat/request/ChatListRequestModel';
import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';

export interface IChatRepository {
    getChatList: (body: ChatListRequestModel) => Promise<ChatItemResponse[]>;
}