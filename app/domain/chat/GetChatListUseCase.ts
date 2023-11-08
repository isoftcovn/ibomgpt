import { ChatListRequestModel } from '@models/chat/request/ChatListRequestModel';
import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';
import { IChatRepository } from '.';
import { IUseCase } from '../index';

export class GetChatListUseCase implements IUseCase<ChatItemResponse[]> {
    chatRepository: IChatRepository;
    body: ChatListRequestModel;

    constructor(chatRepository: IChatRepository, body: ChatListRequestModel) {
        this.chatRepository = chatRepository;
        this.body = body;
    }

    execute = (): Promise<ChatItemResponse[]> => this.chatRepository.getChatList(this.body);
}