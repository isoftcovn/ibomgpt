import ApiGateway from '@data/gateway/api';
import {AppResource} from '@data/gateway/api/resource';
import {ApiType} from '@data/gateway/api/type';
import {IChatRepository} from '@domain/chat';
import {ChatListRequestModel} from '@models/chat/request/ChatListRequestModel';
import {ChatMessagesRequestModel} from '@models/chat/request/ChatMessagesRequestModel';
import {SubmitMessageRequestModel} from '@models/chat/request/SubmitMessageRequestModel';
import {ChatItemResponse} from '@models/chat/response/ChatItemResponse';
import {ChatMessageResponse} from '@models/chat/response/ChatMessageResponse';
import {ChatRoomsOptions} from '@models/chat/response/ChatRoomOptions';
import {ObjectItemResponse} from '@models/chat/response/ObjectItemResponse';
import {SubmitChatResponse} from '@models/chat/response/SubmitChatResponse';
import BaseQueryModel from '@models/general/request/BaseQueryModel';
import {PaginationModel} from '@models/general/response/PaginationModel';
import UserModel from '@models/user/response/UserModel';

export class ChatRepository implements IChatRepository {
    markAsReadConversation = async (
        objectId: number,
        objectInstanceId: number,
    ): Promise<boolean> => {
        const resource = AppResource.Chat.ReadConversation();
        const formData = new FormData();
        formData.append('object_id', objectId);
        formData.append('object_instance_id', objectInstanceId);
        const apiGateway = new ApiGateway({
            method: 'POST',
            resource: resource,
            body: formData,
        });

        await apiGateway.execute();

        return true;
    };

    getChatRoomOptions = async (
        objectId: number,
        objectInstanceId: number,
    ): Promise<ChatRoomsOptions> => {
        const resource = AppResource.Chat.ChatList();
        const formData = new FormData();
        formData.append('object_id', objectId);
        formData.append('object_instance_id', objectInstanceId);
        const apiGateway = new ApiGateway({
            method: 'POST',
            resource: resource,
            body: formData,
        });

        const response = await apiGateway.execute();

        return ChatRoomsOptions.parseFromJson(response);
    };

    getObjectList = async (
        refAPI: string,
        body: BaseQueryModel,
    ): Promise<PaginationModel<ObjectItemResponse>> => {
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
            formData.append(key, value);
        });
        const apiGateway = new ApiGateway({
            method: 'POST',
            resource: {
                Path: refAPI,
                Type: ApiType.Customer,
            },
            body: formData,
        });

        const response = await apiGateway.execute();

        const results: ObjectItemResponse[] =
            response && Array.isArray(response.items)
                ? response.items.map(ObjectItemResponse.parseFromJson)
                : [];
        const pagination = new PaginationModel<ObjectItemResponse>(
            results,
            body.page,
            body.limit,
            response.totalItem ?? 0,
            response.totalItemView ?? 0,
        );

        return pagination;
    };

    getChatSearchForm = async (): Promise<any> => {
        const resource = AppResource.Chat.ChatSearchForm();
        const formdata = new FormData();
        const apiGateway = new ApiGateway({
            method: 'POST',
            resource: resource,
            body: formdata,
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
    ): Promise<[ChatMessageResponse[], UserModel[], string]> => {
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
        const name = response.OBJECT_INSTANCE_NAME ?? '';

        const messages = itemList.map(item =>
            ChatMessageResponse.parseFromJson(item),
        );
        const users = userList.map(item =>
            UserModel.parseFromChatResponse(item),
        );

        return [messages, users, name];
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
