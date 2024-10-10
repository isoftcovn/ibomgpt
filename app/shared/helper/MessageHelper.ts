import {ChatMessageResponse} from '@models/chat/response/ChatMessageResponse';
import {IAppChatMessage} from 'app/presentation/models/chat';
import dayjs from 'dayjs';
import {FileHelper, FileType} from './FileHelper';
import {SubmitMessageRequestModel} from '@models/chat/request/SubmitMessageRequestModel';
import UserModel from '@models/user/response/UserModel';
import {v4} from 'uuid';

export class MessageHelper {
    static shared = new MessageHelper();

    private constructor() {}

    convertMessageResponseToChatMessage = (
        data: ChatMessageResponse,
    ): IAppChatMessage[] => {
        const messages: IAppChatMessage[] = [];
        const dateFormat = 'DD/MM/YYYY h:mmA';
        const createdDateDisplay = data.sentDateDisplay
            .trim()
            .split(' ')
            .filter(item => item.trim().length > 0)
            .join(' ')
            .toUpperCase();
        const createdDate = dayjs(createdDateDisplay, dateFormat);
        if (data.content && data.content.trim().length > 0) {
            messages.push({
                _id: data.id,
                text: data.content ?? '',
                createdAt: createdDate.toDate(),
                user: {
                    _id: data.senderId,
                    avatar: data.avatar,
                    name: data.senderName,
                },
                objectId: data.objectId,
                objectInstanceId: data.objectInstanceId,
                conversationName: data.conversationName,
                allowDelete: data.allowDelete,
                allowEdit: data.allowEdit,
                reactions: data.reaction ?? [],
            });
        }
        if (data.fileList.length > 0) {
            for (let fileItem of data.fileList) {
                const fileType = FileHelper.shared.getFileTypeFromExtensions(
                    fileItem.extension ?? 'others',
                );
                const fileUrl = fileItem.fileUrl;
                const chatMessage: IAppChatMessage = {
                    _id: this.getMediaMessageId(`${data.id}`, `${fileItem.id}`),
                    parentMessageId: data.id,
                    text: '',
                    createdAt: createdDate.toDate(),
                    user: {
                        _id: data.senderId,
                        avatar: data.avatar,
                        name: data.senderName,
                    },
                    objectId: data.objectId,
                    objectInstanceId: data.objectInstanceId,
                    conversationName: data.conversationName,
                    allowDelete: data.allowDelete,
                    allowEdit: data.allowEdit,
                };
                switch (fileType) {
                    case FileType.image:
                        chatMessage.image = fileUrl;
                        // chatMessage.audio = 'https://download.samplelib.com/mp3/sample-15s.mp3';
                        // chatMessage.video = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
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
        return messages.reverse();
    };

    generateMessageLocalId = (): string => {
        return `local_message_${v4()}`;
    };

    convertSentMessageToChatMessage = (
        request: SubmitMessageRequestModel,
        user: UserModel,
    ): IAppChatMessage[] => {
        const messages: IAppChatMessage[] = [];
        const parentMessage: IAppChatMessage = {
            _id: this.generateMessageLocalId(),
            createdAt: new Date(),
            text: request.comment_content,
            user: {
                _id: user.id,
                avatar: user.avatar,
                name: user.fullname,
            },
            objectId: request.object_id,
            objectInstanceId: request.object_instance_id,
            conversationName: '',
        };
        messages.push(parentMessage);

        if ((request.FileUpload?.length ?? 0) > 0) {
            for (const fileItem of request.FileUpload!) {
                const extension = fileItem.uri.split('.').pop();
                if (extension) {
                    const fileType =
                        FileHelper.shared.getFileTypeFromExtensions(extension);
                    const fileUrl = fileItem.uri;
                    const chatMessage: IAppChatMessage = {
                        _id: this.getMediaMessageId(
                            `${parentMessage._id}`,
                            fileItem.name,
                        ),
                        parentMessageId: parentMessage._id,
                        text: '',
                        createdAt: new Date(),
                        user: {
                            _id: user.id,
                            avatar: user.avatar,
                            name: user.fullname,
                        },
                        objectId: request.object_id,
                        objectInstanceId: request.object_instance_id,
                        conversationName: '',
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

        return messages.reverse();
    };

    extractRealMessageId = (messageId: string): number => {
        let requestMessageId: number;
        if (messageId.startsWith('media')) {
            requestMessageId = parseInt(messageId.split('-')[1], 10);
        } else {
            requestMessageId = parseInt(messageId, 10);
        }

        return requestMessageId;
    };

    getMediaMessageId = (messageId: string, fileId: string): string => {
        return `media-${messageId}-${fileId}`;
    };
}
