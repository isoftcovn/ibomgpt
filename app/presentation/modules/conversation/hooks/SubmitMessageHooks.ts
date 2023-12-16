import { ChatRepository } from '@data/repository/chat';
import { SubmitMessageRequestModel } from '@models/chat/request/SubmitMessageRequestModel';
import UserModel from '@models/user/response/UserModel';
import { editMessagesActionTypes, sendMessagesActionTypes, updateLocalMessageIdsActionTypes } from '@redux/actions/conversation';
import { selectProfile } from '@redux/selectors/user';
import { FileHelper } from '@shared/helper/FileHelper';
import { MessageHelper } from '@shared/helper/MessageHelper';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IPickerAsset } from './MediaHooks';
import { ConversationContext } from '../context/ConversationContext';
import { ChatMessageResponse } from '@models/chat/response/ChatMessageResponse';
import { ChatManager } from 'app/presentation/managers/ChatManager';

const sendMessagesToHub = (userIds: string[], message: ChatMessageResponse) => {
    ChatManager.shared.sendMessageToUsers(userIds, message);
};

export const useSendTextMessage = () => {
    const dispatch = useDispatch();
    const { editMessage } = useContext(ConversationContext);
    const sendTextMessage = useCallback(async (messages: IAppChatMessage[], objectInstanceId: number, objectId: number) => {
        const chatRepo = new ChatRepository();
        const requestModels: SubmitMessageRequestModel[] = [];
        const isEdit = !!editMessage;
        for (const item of messages) {
            if (item.text.length > 0) {
                const request = new SubmitMessageRequestModel(objectId, objectInstanceId, 'submit', item.text);
                if (isEdit) {
                    request.comment_id = parseInt(`${editMessage!._id}`, 10);
                }
                requestModels.push(request);
                item._id = isEdit ? parseInt(`${editMessage!._id}`, 10) : MessageHelper.shared.generateMessageLocalId();
                if (!isEdit) {
                    // @ts-ignore
                    request._localMessageId = item._id;
                }
            }
        }
        if (isEdit) {
            dispatch(editMessagesActionTypes.startAction({
                objectId,
                objectInstanceId,
                messages,
            }));
        } else {
            dispatch(sendMessagesActionTypes.startAction(messages, {
                sectionId: `${objectId}-${objectInstanceId}`,
            }));
        }
        const requestCount = requestModels.length;
        let doneRequestCount = 0;
        const localMessageIdAndRealIdMap: Record<string, string> = {};
        for (const request of requestModels) {
            chatRepo.submitChatMessages(request).then(response => {
                const messageId = response?.commentId;
                console.log('send message response: ', response);
                if (!isEdit && messageId) {
                    // @ts-ignore
                    localMessageIdAndRealIdMap[`${request._localMessageId ?? ''}`] = `${messageId}`;

                    const userIds = response?.participants?.map(item => `${item.id}`) ?? [];
                    const messageResponse = response?.commentInfo;
                    if (messageResponse) {
                        sendMessagesToHub(userIds, messageResponse);
                    }
                }
            }).catch(error => {
                console.error('Send message failed: ', error);
            }).finally(() => {
                doneRequestCount++;
                if (doneRequestCount === requestCount && Object.keys(localMessageIdAndRealIdMap).length > 0) {
                    dispatch(updateLocalMessageIdsActionTypes.startAction({
                        messageIdsToReplace: localMessageIdAndRealIdMap,
                        objectId,
                        objectInstanceId
                    }));
                }
            });
        }
        // const ids = await Promise.all(requestModels.map(request => chatRepo.submitChatMessages(request)));
        // if (!isEdit) {

        // }
    }, [dispatch, editMessage]);

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
                _id: `media-${MessageHelper.shared.generateMessageLocalId()}-${item.name}`,
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
        const requestCount = requests.length;
        let doneRequestCount = 0;
        const localMessageIdAndRealIdMap: Record<string, string> = {};
        requests.forEach((request, index) => {
            chatRepo.submitChatMessages(request).then(response => {
                const messageId = response?.commentId;
                console.info('Sent media message done: ', messageId, request.FileUpload?.[0]?.name);
                const localMessageId = messages[index]?._id;
                if (localMessageId && messageId) {
                    localMessageIdAndRealIdMap[`${localMessageId}`] = `${messageId}`;
                }

                const userIds = response?.participants?.map(item => `${item.id}`) ?? [];
                const messageResponse = response?.commentInfo;
                if (messageResponse) {
                    sendMessagesToHub(userIds, messageResponse);
                }
            }).catch(error => {
                console.info('Sent media message error: ', request.FileUpload?.[0]?.name);
                console.info(error);
            }).finally(() => {
                doneRequestCount++;
                if (doneRequestCount === requestCount && Object.keys(localMessageIdAndRealIdMap).length > 0) {
                    dispatch(updateLocalMessageIdsActionTypes.startAction({
                        messageIdsToReplace: localMessageIdAndRealIdMap,
                        objectId,
                        objectInstanceId
                    }));
                }
            });
        });
        // for (const request of requests) {
        //     chatRepo.submitChatMessages(request).then(messageId => {
        //         console.info('Sent media message done: ', messageId, request.FileUpload?.[0]?.name);
        //     }).catch(error => {
        //         console.info('Sent media message error: ', request.FileUpload?.[0]?.name);
        //         console.info(error);
        //     });
        // }
        // await chatRepo.submitChatMessages(request);
    }, [dispatch, user]);

    return {
        sendMediaMessage
    };
};
