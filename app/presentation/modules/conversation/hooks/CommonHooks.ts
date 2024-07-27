import Clipboard from '@react-native-clipboard/clipboard';
import { deleteMessageActionTypes, deleteMessageRealtimeActionTypes, editMessagesActionTypes, receiveNewMessagesActionTypes } from '@redux/actions/conversation';
import { selectUserId } from '@redux/selectors/user';
import { theme } from '@theme/index';
import { ChatManager } from 'app/presentation/managers/ChatManager';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ConversationContext, ConversationInputContext } from '../context/ConversationContext';

export const useOnMessageLongPress = (objectId: number, objectInstanceId: number) => {
    const userId = useSelector(selectUserId);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { setEditMessage } = useContext(ConversationContext);

    const onMessageLongPress = useCallback((context: any, currentMessage: IAppChatMessage) => {
        // eslint-disable-next-line eqeqeq
        const isMyMessage = currentMessage.user._id == userId;
        let disabledEdit = !(currentMessage.allowEdit ?? false);
        const disabledDelete = !(currentMessage.allowDelete ?? false);
        const options: string[] = [];
        if (currentMessage.text) {
            options.push(t('copy'));
        }
        // Messages with local id can not be editted
        if (isMyMessage && currentMessage.text) {
            options.push(t('edit'));
            if (`${currentMessage._id}`.startsWith('local')) {
                disabledEdit  = true;
            }
        }
        if (isMyMessage) {
            options.push(t('delete'));
        }
        if (options.length === 0) { return; }
        options.push(t('close'));
        const cancelButtonIndex = options.length - 1;
        const destructiveButtonIndex = options.indexOf(t('delete'));
        const disabledButtonIndices: number[] = [];
        if (disabledEdit) {
            const index = options.indexOf(t('edit'));
            if (index !== -1) {
                disabledButtonIndices.push(index);
            }
        }
        if (disabledDelete) {
            const index = options.indexOf(t('delete'));
            if (index !== -1) {
                disabledButtonIndices.push(index);
            }
        }
        context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveColor: theme.color.danger,
                destructiveButtonIndex: isMyMessage ? destructiveButtonIndex : undefined,
                disabledButtonIndices,
            },
            (buttonIndex: number) => {
                const option: string | undefined = options[buttonIndex];
                switch (option) {
                    case t('copy'):
                        Clipboard.setString(currentMessage.text);
                        break;
                    case t('edit'):
                        // edit
                        if (isMyMessage) {
                            console.info('Edit message: ', currentMessage);
                            setEditMessage(currentMessage);
                        }
                        break;
                    case t('delete'):
                        // delete
                        if (isMyMessage) {
                            dispatch(deleteMessageActionTypes.startAction({
                                messageId: `${currentMessage._id}`,
                                objectId,
                                objectInstanceId
                            }));
                        }
                        break;
                }
            });
    }, [userId, t, dispatch, objectId, objectInstanceId, setEditMessage]);

    return {
        onMessageLongPress
    };
};

export const useIsInEditMode = () => {
    const { editMessage } = useContext(ConversationContext);

    return useMemo(() => ({
        editMessage,
        isInEditMode: !!editMessage
    }), [editMessage]);
};

export const useInputText = () => {
    const { setText, text } = useContext(ConversationInputContext);

    return useMemo(() => ({
        text,
        setText
    }), [text, setText]);
};

export const useRealtimeMessage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const receiveMessageSubcription = ChatManager.shared.receiveMessageEvent.subscribe(messages => {
            dispatch(receiveNewMessagesActionTypes.startAction(messages));
        });

        const editMessageSubscription = ChatManager.shared.editMessageEvent.subscribe(event => {
            const {content, messageId, objectId, objectInstanceId} = event;
            const editMessage: IAppChatMessage = {
                _id: messageId,
                text: content,
                createdAt: new Date(),
                user: {
                    _id: 0,
                },
            };
            dispatch(editMessagesActionTypes.startAction({
                messages: [editMessage],
                objectId,
                objectInstanceId,
            }));
        });

        const deleteMessageSubscription = ChatManager.shared.deleteMessageEvent.subscribe(event => {
            const {messageId, objectId, objectInstanceId} = event;
            dispatch(deleteMessageRealtimeActionTypes.startAction({
                messageId,
                objectId,
                objectInstanceId,
            }));
        });

        return () => {
            receiveMessageSubcription.unsubscribe();
            editMessageSubscription.unsubscribe();
            deleteMessageSubscription.unsubscribe();
        };
    }, [dispatch]);
};
