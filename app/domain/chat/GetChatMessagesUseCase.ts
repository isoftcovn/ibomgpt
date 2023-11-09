import { ChatMessagesRequestModel } from '@models/chat/request/ChatMessagesRequestModel';
import { MessageHelper } from '@shared/helper/MessageHelper';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { IChatRepository } from '.';
import { IUseCase } from '../index';

export class GetChatMessagesUseCase implements IUseCase<IAppChatMessage[]> {
    chatRepository: IChatRepository;
    body: ChatMessagesRequestModel;

    constructor(chatRepository: IChatRepository, body: ChatMessagesRequestModel) {
        this.chatRepository = chatRepository;
        this.body = body;
    }

    execute = async (): Promise<IAppChatMessage[]> => {
        const messages = await this.chatRepository.getChatMessages(this.body);
        const appMessages: IAppChatMessage[] = [];
        for (const message of messages) {
            appMessages.concat(MessageHelper.shared.convertMessageResponseToChatMessage(message));
        }
        return appMessages;
    };
}