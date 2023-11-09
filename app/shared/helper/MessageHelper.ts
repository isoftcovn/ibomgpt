import { ChatMessageResponse } from '@models/chat/response/ChatMessageResponse';
import { IAppChatMessage } from 'app/presentation/models/chat';
import dayjs from 'dayjs';
import { FileHelper, FileType } from './FileHelper';

export class MessageHelper {
    static shared = new MessageHelper();

    private constructor() { }

    convertMessageResponseToChatMessage = (data: ChatMessageResponse): IAppChatMessage[] => {
        const messages: IAppChatMessage[] = [];
        if (data.content && data.content.trim().length > 0) {
            const dateFormat = 'DD/MM/YYYY h:mmA';
            const createdDateDisplay = data.sentDateDisplay.trim().split(' ').filter(item => item.trim().length > 0).join(' ').toUpperCase();
            const createdDate = dayjs(createdDateDisplay, dateFormat);
            messages.push({
                _id: data.id,
                text: data.content ?? '',
                createdAt: createdDate.toDate(),
                user: {
                    _id: data.senderId,
                    avatar: data.avatar,
                },
            });
            if (data.fileList.length > 0) {
                for (let fileItem of data.fileList) {
                    const fileType = FileHelper.shared.getFileTypeFromExtensions(fileItem.extension ?? 'others');
                    const fileUrl = fileItem.fileUrl;
                    const chatMessage: IAppChatMessage = {
                        _id: `media-${data.id}-${fileItem.id}`,
                        text: '',
                        createdAt: createdDate.toDate(),
                        user: {
                            _id: data.senderId,
                            avatar: data.avatar,
                        },
                    };
                    switch (fileType) {
                        case FileType.image:
                            chatMessage.image = fileUrl;
                            break;
                        case FileType.audio:
                            chatMessage.audio = fileUrl;
                            break;
                        case FileType.video:
                            chatMessage.video = fileUrl;
                            break;
                        default:
                            chatMessage.fileUrl = fileUrl;
                            chatMessage.fileType = fileType;
                            break;
                    }
                    messages.push(chatMessage);
                }
            }
        }
        return messages;
    };
}
