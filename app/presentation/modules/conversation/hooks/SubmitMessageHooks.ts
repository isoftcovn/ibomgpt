import { ChatRepository } from '@data/repository/chat';
import { SubmitMessageRequestModel } from '@models/chat/request/SubmitMessageRequestModel';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { useCallback } from 'react';
import { IPickerAsset } from './MediaHooks';
import { useDispatch } from 'react-redux';
import { getMessagesActionTypes } from '@redux/actions/conversation';
import { MessageHelper } from '@shared/helper/MessageHelper';

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
        dispatch(getMessagesActionTypes.successAction(messages, {
            isPrepend: true,
            sectionId: `${objectId}-${objectInstanceId}`,
        }));
        await Promise.all(requestModels.map(request => chatRepo.sendChatMessages(request)));
    }, [dispatch]);

    return {
        sendTextMessage
    };
};

export const useSendMediaMessage = () => {
    const sendMediaMessage = useCallback(async (assets: IPickerAsset[], objectInstanceId: number, objectId: number) => {
        const chatRepo = new ChatRepository();
        const request = new SubmitMessageRequestModel(objectId, objectInstanceId, 'submit', '');
        request.FileUpload = assets.map(item => ({
            name: item.name,
            type: item.mime ?? '',
            uri: item.uri,
        }));
        await chatRepo.sendChatMessages(request);
    }, []);

    return {
        sendMediaMessage
    };
};
