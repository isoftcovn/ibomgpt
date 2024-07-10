import { FileType } from '@shared/helper/FileHelper';
import { IMessage } from 'react-native-gifted-chat';

export interface IAppChatMessage extends IMessage {
    fileType?: FileType;
    fileUrl?: string;
    parentMessageId?: string | number;
    objectId?: number;
    objectInstanceId?: number;
    conversationName: string;
}
