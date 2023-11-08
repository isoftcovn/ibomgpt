import ApiGateway from '@data/gateway/api';
import { AppResource } from '@data/gateway/api/resource';
import { IChatRepository } from '@domain/chat';
import { ChatListRequestModel } from '@models/chat/request/ChatListRequestModel';
import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';

export class ChatRepository implements IChatRepository {
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