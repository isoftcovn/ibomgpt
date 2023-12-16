import { ChatListRequestModel } from '@models/chat/request/ChatListRequestModel';
import { ChatMessagesRequestModel } from '@models/chat/request/ChatMessagesRequestModel';
import { SubmitMessageRequestModel } from '@models/chat/request/SubmitMessageRequestModel';
import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';
import { ChatMessageResponse } from '@models/chat/response/ChatMessageResponse';
import { SubmitChatResponse } from '@models/chat/response/SubmitChatResponse';

export interface IChatRepository {
    getChatList: (body: ChatListRequestModel) => Promise<{items: ChatItemResponse[], avatar?: string}>;
    getChatMessages: (body: ChatMessagesRequestModel) => Promise<ChatMessageResponse[]>;
    submitChatMessages: (body: SubmitMessageRequestModel) => Promise<SubmitChatResponse | undefined>;
}
