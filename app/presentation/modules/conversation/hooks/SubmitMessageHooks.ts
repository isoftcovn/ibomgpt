import { ChatRepository } from '@data/repository/chat';
import { SubmitMessageRequestModel } from '@models/chat/request/SubmitMessageRequestModel';
import { ChatMessageResponse } from '@models/chat/response/ChatMessageResponse';
import UserModel from '@models/user/response/UserModel';
import { editMessagesActionTypes, sendMessagesActionTypes, updateLocalMessageIdsActionTypes } from '@redux/actions/conversation';
import { selectParticipantsByKey } from '@redux/selectors/conversation';
import { selectProfile } from '@redux/selectors/user';
import { FileHelper } from '@shared/helper/FileHelper';
import { MessageHelper } from '@shared/helper/MessageHelper';
import { ChatHelper } from 'app/presentation/managers/ChatManager.helper';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { useCallback, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConversationContext } from '../context/ConversationContext';
import { IPickerAsset } from './MediaHooks';

const sendMessagesToHub = async (userIds: string[], message: ChatMessageResponse) => {
    ChatHelper.shared.sendNewMessagesEvent(userIds, message.rawData);
};

export const useSendTextMessage = (objectId: number, objectInstanceId: number) => {
    const dispatch = useDispatch();
    const { editMessage, setEditMessage } = useContext(ConversationContext);
    const key = useMemo(() => `${objectId}-${objectInstanceId}`, [objectId, objectInstanceId]);
    const participants = useSelector(state => selectParticipantsByKey(state, key));
    const sendTextMessage = useCallback(async (messages: IAppChatMessage[]) => {
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
            setEditMessage(undefined);
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
                const userIds = participants.map(item => `${item.id}`);
                if (!isEdit && messageId) {
                    // @ts-ignore
                    localMessageIdAndRealIdMap[`${request._localMessageId ?? ''}`] = `${messageId}`;

                    const messageResponse = response?.commentInfo;
                    if (messageResponse) {
                        sendMessagesToHub(userIds, messageResponse);
                    }
                } else if (isEdit && editMessage) {
                    ChatHelper.shared.sendEditMessageEvent(userIds, {
                        objectId,
                        objectInstanceId,
                        messageId: `${editMessage._id}`,
                        content: request.comment_content,
                    });
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
    }, [dispatch, editMessage, objectId, objectInstanceId, participants, setEditMessage]);

    return {
        sendTextMessage
    };
};

export const useSendMediaMessage = (objectId: number, objectInstanceId: number) => {
    const dispatch = useDispatch();
    const user: UserModel | undefined = useSelector(selectProfile).data;
    const key = useMemo(() => `${objectId}-${objectInstanceId}`, [objectId, objectInstanceId]);
    const participants = useSelector(state => selectParticipantsByKey(state, key));
    const sendMediaMessage = useCallback(async (assets: IPickerAsset[]) => {
        if (!user) { return; }
        const chatRepo = new ChatRepository();
        // const request = new SubmitMessageRequestModel(objectId, objectInstanceId, 'submit', '');
        // request.FileUpload = assets.map(item => ({
        //     name: item.name,
        //     type: item.mime ?? '',
        //     uri: item.uri,
        // }));
        const requests: SubmitMessageRequestModel[] = assets.map(item => {
            const request = new SubmitMessageRequestModel(objectId, objectInstanceId, 'submit', '');
            request.FileUpload = [{
                name: item.name,
                type: item.mime ?? '',
                uri: item.uri,
            }];

            return request;
        });
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
                const commentInfo = response?.commentInfo;
                const fileId = commentInfo?.fileList?.[0]?.id;
                console.info('Sent media message done: ', messageId, request.FileUpload?.[0]?.name);
                const localMessageId = messages[index]?._id;
                if (localMessageId && messageId && fileId) {
                    localMessageIdAndRealIdMap[`${localMessageId}`] = `media-${messageId}-${fileId}`;
                }

                const userIds = participants.map(item => `${item.id}`);
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
    }, [dispatch, user, objectId, objectInstanceId, participants]);

    return {
        sendMediaMessage
    };
};
