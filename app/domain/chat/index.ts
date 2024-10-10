import { ChatListRequestModel } from '@models/chat/request/ChatListRequestModel';
import { ChatMessagesRequestModel } from '@models/chat/request/ChatMessagesRequestModel';
import { ReactionRequestModel } from '@models/chat/request/ReactionRequestModel';
import { SubmitMessageRequestModel } from '@models/chat/request/SubmitMessageRequestModel';
import { UndoReactionRequestModel } from '@models/chat/request/UndoReactionRequestModel';
import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';
import { ChatMessageResponse } from '@models/chat/response/ChatMessageResponse';
import { ChatRoomsOptions } from '@models/chat/response/ChatRoomOptions';
import { ObjectItemResponse } from '@models/chat/response/ObjectItemResponse';
import { SubmitChatResponse } from '@models/chat/response/SubmitChatResponse';
import BaseQueryModel from '@models/general/request/BaseQueryModel';
import { PaginationModel } from '@models/general/response/PaginationModel';
import UserModel from '@models/user/response/UserModel';

export interface IChatRepository {
    getChatList: (body: ChatListRequestModel) => Promise<{items: ChatItemResponse[], avatar?: string}>;
    getChatMessages: (body: ChatMessagesRequestModel) => Promise<[ChatMessageResponse[], UserModel[], string]>;
    submitChatMessages: (body: SubmitMessageRequestModel) => Promise<SubmitChatResponse | undefined>;
    getChatSearchForm: () => Promise<any>;
    getObjectList: (refAPI: string, body: BaseQueryModel) => Promise<PaginationModel<ObjectItemResponse>>;
    getChatRoomOptions: (objectId: number, objectInstanceId: number) => Promise<ChatRoomsOptions>;
    markAsReadConversation: (objectId: number, objectInstanceId: number) => Promise<boolean>;
    reactToMessage: (body: ReactionRequestModel) => Promise<boolean>;
    removeReaction: (body: UndoReactionRequestModel) => Promise<boolean>;
}
