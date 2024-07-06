import ApiGateway from '@data/gateway/api';
import {AppResource} from '@data/gateway/api/resource';
import {IChatRepository} from '@domain/chat';
import {ChatListRequestModel} from '@models/chat/request/ChatListRequestModel';
import {ChatMessagesRequestModel} from '@models/chat/request/ChatMessagesRequestModel';
import {SubmitMessageRequestModel} from '@models/chat/request/SubmitMessageRequestModel';
import {ChatItemResponse} from '@models/chat/response/ChatItemResponse';
import {ChatMessageResponse} from '@models/chat/response/ChatMessageResponse';
import {SubmitChatResponse} from '@models/chat/response/SubmitChatResponse';
import UserModel from '@models/user/response/UserModel';

export class ChatRepository implements IChatRepository {
    getChatSearchForm = async (): Promise<any> => {
        const resource = AppResource.Chat.ChatSearchForm();
        const formdata = new FormData();
        const apiGateway = new ApiGateway({
            method: 'POST',
            resource: resource,
            body: formdata
        });

        const response = await apiGateway.execute();

        return response;
    };

    submitChatMessages = async (
        body: SubmitMessageRequestModel,
    ): Promise<SubmitChatResponse | undefined> => {
        const resource = AppResource.Chat.ChatList();
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
            if (key !== 'FileUpload') {
                formData.append(key, value);
            }
        });
        if (body.FileUpload) {
            body.FileUpload!.forEach(file => {
                formData.append('FileUpload', {
                    name: file.name,
                    type: file.type,
                    uri: file.uri,
                });
            });
        }

        const apiGateway = new ApiGateway({
            method: 'POST',
            resource: resource,
            body: formData,
        });

        const response = await apiGateway.execute();
        return SubmitChatResponse.parseFromResponse(response);
    };

    getChatMessages = async (
        body: ChatMessagesRequestModel,
    ): Promise<[ChatMessageResponse[], UserModel[]]> => {
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
        const userList: any[] = response.userList ?? [];

        const messages = itemList.map(item =>
            ChatMessageResponse.parseFromJson(item),
        );
        const users = userList.map(item =>
            UserModel.parseFromChatResponse(item),
        );

        return [messages, users];
    };

    getChatList = async (
        body: ChatListRequestModel,
    ): Promise<{items: ChatItemResponse[]; avatar?: string}> => {
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

        return {
            items: itemList.map(item => ChatItemResponse.parseFromJson(item)),
            avatar: response.avatar,
        };
    };
}
