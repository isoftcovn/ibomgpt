import {ChatRepository} from '@data/repository/chat';
import {
    deleteMessageRealtimeActionTypes,
    editMessagesActionTypes,
    receiveNewMessagesActionTypes,
    updateReadConversationActionTypes,
} from '@redux/actions/conversation';
import {selectUserId} from '@redux/selectors/user';
import {ChatManager} from 'app/presentation/managers/ChatManager';
import {IAppChatMessage} from 'app/presentation/models/chat';
import {useCallback, useContext, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {GestureResponderEvent} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {MeasureOnSuccessCallback} from '../components/CustomBubble.model';
import {
    ConversationContext,
    ConversationInputContext,
} from '../context/ConversationContext';
import ContextMenuModalHelper from '../helper/ContextMenuModalHelper';

export const useOnMessageLongPress = (
    objectId: number,
    objectInstanceId: number,
) => {
    const onMessageLongPress = useCallback(
        (
            context: any,
            currentMessage: IAppChatMessage,
            event: GestureResponderEvent,
            viewMeasured: MeasureOnSuccessCallback,
        ) => {
            ContextMenuModalHelper.showContextMenu({
                message: currentMessage,
                viewMeasured,
            });
        },
        [],
    );

    return {
        onMessageLongPress,
    };
};

export const useIsInEditMode = () => {
    const {editMessage} = useContext(ConversationContext);

    return useMemo(
        () => ({
            editMessage,
            isInEditMode: !!editMessage,
        }),
        [editMessage],
    );
};

export const useInputText = () => {
    const {setText, text} = useContext(ConversationInputContext);

    return useMemo(
        () => ({
            text,
            setText,
        }),
        [text, setText],
    );
};

export const useRealtimeMessage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const receiveMessageSubcription =
            ChatManager.shared.receiveMessageEvent.subscribe(messages => {
                dispatch(receiveNewMessagesActionTypes.startAction(messages));
            });

        const editMessageSubscription =
            ChatManager.shared.editMessageEvent.subscribe(event => {
                const {content, messageId, objectId, objectInstanceId} = event;
                const editMessage: IAppChatMessage = {
                    _id: messageId,
                    text: content,
                    createdAt: new Date(),
                    user: {
                        _id: 0,
                    },
                };
                dispatch(
                    editMessagesActionTypes.startAction({
                        messages: [editMessage],
                        objectId,
                        objectInstanceId,
                    }),
                );
            });

        const deleteMessageSubscription =
            ChatManager.shared.deleteMessageEvent.subscribe(event => {
                const {messageId, objectId, objectInstanceId} = event;
                dispatch(
                    deleteMessageRealtimeActionTypes.startAction({
                        messageId,
                        objectId,
                        objectInstanceId,
                    }),
                );
            });

        return () => {
            receiveMessageSubcription.unsubscribe();
            editMessageSubscription.unsubscribe();
            deleteMessageSubscription.unsubscribe();
        };
    }, [dispatch]);
};

export const useMarkAsReadConversation = (
    objectId: number,
    objectInstanceId: number,
) => {
    const dispatch = useDispatch();
    const markAsRead = useCallback(() => {
        const chatRepo = new ChatRepository();
        chatRepo
            .markAsReadConversation(objectId, objectInstanceId)
            .catch(() => {});
        dispatch(
            updateReadConversationActionTypes.startAction({
                objectId,
                objectInstanceId,
            }),
        );
    }, [objectId, objectInstanceId, dispatch]);

    return {markAsRead};
};
