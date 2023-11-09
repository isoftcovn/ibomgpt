import ApiGateway from '@data/gateway/api';
import { AppResource } from '@data/gateway/api/resource';
import { IChatRepository } from '@domain/chat';
import { ChatListRequestModel } from '@models/chat/request/ChatListRequestModel';
import { ChatMessagesRequestModel } from '@models/chat/request/ChatMessagesRequestModel';
import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';
import { ChatMessageResponse } from '@models/chat/response/ChatMessageResponse';

export class ChatRepository implements IChatRepository {
    getChatMessages = async (body: ChatMessagesRequestModel): Promise<ChatMessageResponse[]> => {
        const resource = AppResource.Chat.ChatList();
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
            formData.append(key, value);
        });
        const apiGateway = new ApiGateway({
            method: 'POST',
            resource: resource,
            body: formData,
        });

        const response = await apiGateway.execute();
        const itemList: any[] = response.itemList ?? [];

        return itemList.map(item => ChatMessageResponse.parseFromJson(item));
    };

    getChatList = async (body: ChatListRequestModel): Promise<ChatItemResponse[]> => {
        const resource = AppResource.Chat.ChatList();
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
            formData.append(key, value);
        });
        const apiGateway = new ApiGateway({
            method: 'POST',
            resource: resource,
            body: formData,
        });

        const response = await apiGateway.execute();
        const itemList: any[] = response.itemList ?? [];

        return itemList.map(item => ChatItemResponse.parseFromJson(item));
    };

}