import { ChatRepository } from '@data/repository/chat';
import { SubmitMessageRequestModel } from '@models/chat/request/SubmitMessageRequestModel';
import UserModel from '@models/user/response/UserModel';
import { sendMessagesActionTypes } from '@redux/actions/conversation';
import { selectProfile } from '@redux/selectors/user';
import { FileHelper } from '@shared/helper/FileHelper';
import { MessageHelper } from '@shared/helper/MessageHelper';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IPickerAsset } from './MediaHooks';

export const useSendTextMessage = () => {
    const dispatch = useDispatch();
    const sendTextMessage = useCallback(async (messages: IAppChatMessage[], objectInstanceId: number, objectId: number) => {
        const chatRepo = new ChatRepository();
        const requestModels: SubmitMessageRequestModel[] = [];
        for (const item of messages) {
            if (item.text.length > 0) {
                const request = new SubmitMessageRequestModel(objectId, objectInstanceId, 'submit', item.text);
                requestModels.push(request);
                item._id = MessageHelper.shared.generateMessageLocalId();
            }
        }
        dispatch(sendMessagesActionTypes.startAction(messages, {
            sectionId: `${objectId}-${objectInstanceId}`,
        }));
        await Promise.all(requestModels.map(request => chatRepo.submitChatMessages(request)));
    }, [dispatch]);

    return {
        sendTextMessage
    };
};

export const useSendMediaMessage = () => {
    const dispatch = useDispatch();
    const user: UserModel | undefined = useSelector(selectProfile).data;
    const sendMediaMessage = useCallback(async (assets: IPickerAsset[], objectInstanceId: number, objectId: number) => {
        if (!user) { return; }
        const chatRepo = new ChatRepository();
        // const request = new SubmitMessageRequestModel(objectId, objectInstanceId, 'submit', '');
        // request.FileUpload = assets.map(item => ({
        //     name: item.name,
        //     type: item.mime ?? '',
        //     uri: item.uri,
        // }));
        const requests: SubmitMessageRequestModel[] = assets.map(item => ({
            object_id: objectId,
            object_instance_id: objectInstanceId,
            mode: 'submit',
            comment_content: '',
            FileUpload: [{
                name: item.name,
                type: item.mime ?? '',
                uri: item.uri,
            }]
        }));
        const messages: IAppChatMessage[] = assets.map(item => {
            const message: IAppChatMessage = {
                _id: MessageHelper.shared.generateMessageLocalId(),
                user: {
                    _id: user.id,
                    avatar: user.avatar,
                    name: user.fullname,
                },
                text: '',
                createdAt: new Date(),
            };
            const mime = item.mime ?? '';
            if (mime.startsWith('image')) {
                message.image = item.uri;
            } else if (mime.startsWith('video')) {
                message.video = item.uri;
            } else if (mime.startsWith('audio')) {
                message.audio = item.uri;
            } else {
                const extension = item.uri.split('.').pop() ?? '';
                message.fileType = FileHelper.shared.getFileTypeFromExtensions(extension);
                message.fileUrl = item.uri;
            }

            return message;
        });
        dispatch(sendMessagesActionTypes.startAction(messages, {
            sectionId: `${objectId}-${objectInstanceId}`,
        }));
        for (const request of requests) {
            chatRepo.submitChatMessages(request).then(() => {
                console.info('Sent media message done: ', request.FileUpload?.[0]?.name);
            }).catch(error => {
                console.info('Sent media message error: ', request.FileUpload?.[0]?.name);
                console.info(error);
            });
        }
        // await chatRepo.submitChatMessages(request);
    }, [dispatch, user]);

    return {
        sendMediaMessage
    };
};
