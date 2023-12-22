import Clipboard from '@react-native-clipboard/clipboard';
import { deleteMessageActionTypes, receiveNewMessagesActionTypes } from '@redux/actions/conversation';
import { selectUserId } from '@redux/selectors/user';
import { theme } from '@theme/index';
import { ChatManager } from 'app/presentation/managers/ChatManager';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Subscription } from 'rxjs';
import { ConversationContext, ConversationInputContext } from '../context/ConversationContext';

export const useOnMessageLongPress = (objectId: number, objectInstanceId: number) => {
    const userId = useSelector(selectUserId);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { setEditMessage } = useContext(ConversationContext);

    const onMessageLongPress = useCallback((context: any, currentMessage: IAppChatMessage) => {
        // eslint-disable-next-line eqeqeq
        const isMyMessage = currentMessage.user._id == userId;
        const options: string[] = [];
        if (currentMessage.text) {
            options.push(t('copy'));
        }
        if (isMyMessage && currentMessage.text) {
            options.push(t('edit'));
        }
        if (isMyMessage) {
            options.push(t('delete'));
        }
        if (options.length === 0) { return; }
        options.push(t('close'));
        const cancelButtonIndex = options.length - 1;
        const destructiveButtonIndex = options.indexOf(t('delete'));
        context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveColor: theme.color.danger,
                destructiveButtonIndex: isMyMessage ? destructiveButtonIndex : undefined,
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
    const receiveMessageSubcription = useRef<Subscription | undefined>();
    const dispatch = useDispatch();

    useEffect(() => {
        receiveMessageSubcription.current = ChatManager.shared.receiveMessageEvent.subscribe(messages => {
            dispatch(receiveNewMessagesActionTypes.startAction(messages));
        });

        return () => {
            receiveMessageSubcription.current?.unsubscribe();
        };
    }, [dispatch]);
};
