import { ChatMessagesRequestModel } from '@models/chat/request/ChatMessagesRequestModel';
import { MessageHelper } from '@shared/helper/MessageHelper';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { IChatRepository } from '.';
import { IUseCase } from '../index';
import UserModel from '@models/user/response/UserModel';

export class GetChatMessagesUseCase implements IUseCase<[IAppChatMessage[], UserModel[]]> {
    chatRepository: IChatRepository;
    body: ChatMessagesRequestModel;

    constructor(chatRepository: IChatRepository, body: ChatMessagesRequestModel) {
        this.chatRepository = chatRepository;
        this.body = body;
    }

    execute = async (): Promise<[IAppChatMessage[], UserModel[]]> => {
        const response = await this.chatRepository.getChatMessages(this.body);
        const [messages, users] = response;
        let appMessages: IAppChatMessage[] = [];
        for (const message of messages) {
            appMessages = appMessages.concat(MessageHelper.shared.convertMessageResponseToChatMessage(message));
        }
        return [appMessages, users];
    };
}
