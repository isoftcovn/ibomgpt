import GeneratedImages from '@assets/GeneratedImages';
import {ChatRepository} from '@data/repository/chat';
import {ReactionRequestModel} from '@models/chat/request/ReactionRequestModel';
import {UndoReactionRequestModel} from '@models/chat/request/UndoReactionRequestModel';
import Clipboard from '@react-native-clipboard/clipboard';
import {
    IUpdateMessageReactionPayload,
    deleteMessageActionTypes,
    updateMessageReactionActionTypes,
} from '@redux/actions/conversation';
import {selectProfileData, selectUserId} from '@redux/selectors/user';
import {theme} from '@theme/index';
import {ReactionModel} from 'app/presentation/models/ReactionModel';
import {IAppChatMessage} from 'app/presentation/models/chat';
import {useCallback, useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {ConversationContext} from '../context/ConversationContext';
import {ContextMenuActionButtonModel} from './ContextMenuModal.model';
import {selectParticipantsByKey} from '@redux/selectors/conversation';
import {MessageHelper} from '@shared/helper/MessageHelper';
import { ChatHelper } from 'app/presentation/managers/ChatManager.helper';

export const useContextMenuActionButtons = (
    currentMessage?: IAppChatMessage,
) => {
    const {t} = useTranslation();
    const userId = useSelector(selectUserId);
    return useMemo(() => {
        if (!currentMessage) {
            return [];
        }
        const isLocalMessage = `${currentMessage._id}`.startsWith('local');
        const buttons: ContextMenuActionButtonModel[] = [];
        const isMyMessage = currentMessage.user._id == userId;
        let disabledEdit = !(currentMessage.allowEdit ?? true);
        const disabledDelete = !(currentMessage.allowDelete ?? true);

        // Messages with local id can not be reply
        if (isLocalMessage === false) {
            buttons.push(
                new ContextMenuActionButtonModel(
                    'reply',
                    t('reply'),
                    GeneratedImages.icon_reply,
                    theme.color.colorSecondary,
                ),
            );
        }

        // Messages with local id can not be editted
        if (
            isMyMessage &&
            currentMessage.text &&
            isLocalMessage === false &&
            disabledEdit === false
        ) {
            buttons.push(
                new ContextMenuActionButtonModel(
                    'edit',
                    t('edit'),
                    GeneratedImages.icon_edit,
                    theme.color.colorPrimary,
                ),
            );
        }
        if (currentMessage.text) {
            buttons.push(
                new ContextMenuActionButtonModel(
                    'copy',
                    t('copy'),
                    GeneratedImages.icon_copy,
                    theme.color.colorPrimary,
                ),
            );
        }
        if (isMyMessage && disabledDelete === false) {
            buttons.push(
                new ContextMenuActionButtonModel(
                    'delete',
                    t('delete'),
                    GeneratedImages.icon_trash,
                    theme.color.danger,
                ),
            );
        }
        return buttons;
    }, [currentMessage, t, userId]);
};

export const useContextMenuActionButtonPressed = (
    currentMessage?: IAppChatMessage,
) => {
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const {setEditMessage} = useContext(ConversationContext);
    return useCallback(
        (button: ContextMenuActionButtonModel) => {
            if (!currentMessage) {
                return;
            }
            const objectId = currentMessage.objectId!;
            const objectInstanceId = currentMessage.objectInstanceId!;
            const isMyMessage = currentMessage.user._id == userId;
            switch (button.id) {
                case 'reply':
                    break;
                case 'edit':
                    if (isMyMessage) {
                        console.info('Edit message: ', currentMessage);
                        setEditMessage(currentMessage);
                    }
                    break;
                case 'copy':
                    Clipboard.setString(currentMessage.text);
                    break;
                case 'delete':
                    if (isMyMessage) {
                        dispatch(
                            deleteMessageActionTypes.startAction({
                                messageId: `${currentMessage._id}`,
                                objectId,
                                objectInstanceId,
                            }),
                        );
                    }
                    break;
                default:
                    break;
            }
        },
        [currentMessage, dispatch, setEditMessage, userId],
    );
};

export const useContextMenuReactionPressed = (
    currentMessage?: IAppChatMessage,
) => {
    const key = useMemo(
        () => `${currentMessage?.objectId}-${currentMessage?.objectInstanceId}`,
        [currentMessage],
    );
    const user = useSelector(selectProfileData);
    const participants = useSelector(state =>
        selectParticipantsByKey(state, key),
    );
    const dispatch = useDispatch();
    return useCallback(
        (reaction: ReactionModel) => {
            if (!currentMessage || !user) {
                return;
            }
            const messageId = MessageHelper.shared.extractRealMessageId(currentMessage._id.toString());
            const repo = new ChatRepository();
            const request = new ReactionRequestModel(
                reaction.id,
                messageId,
                currentMessage.objectId!,
                currentMessage.objectInstanceId!,
            );

            repo.reactToMessage(request)
                .then(() => {
                    console.info('Reaction added');
                })
                .catch(error => {
                    console.error('Error adding reaction', error);
                });
            const userIds = participants.map(item => `${item.id}`);
            const payload: IUpdateMessageReactionPayload = {
                reactionData: {
                    messageId: messageId,
                    reaction: reaction.id,
                    objectId: currentMessage.objectId!,
                    objectInstanceId: currentMessage.objectInstanceId!,
                },
                user: {
                    id: user.id,
                    avatar: user.avatar,
                    fullname: user.fullname,
                },
                actType: 'add',
            };
            dispatch(updateMessageReactionActionTypes.startAction(payload));
            ChatHelper.shared.sendReactionEvent(userIds, payload);
        },
        [currentMessage, user, dispatch, participants],
    );
};

export const useContextMenuUndoReactionPressed = (
    currentMessage?: IAppChatMessage,
) => {
    const user = useSelector(selectProfileData);
    const key = useMemo(
        () => `${currentMessage?.objectId}-${currentMessage?.objectInstanceId}`,
        [currentMessage],
    );
    const participants = useSelector(state =>
        selectParticipantsByKey(state, key),
    );
    const dispatch = useDispatch();
    return useCallback(() => {
        if (!currentMessage || !user) {
            return;
        }
        const repo = new ChatRepository();
        const request = new UndoReactionRequestModel(
            currentMessage._id,
            currentMessage.objectId!,
            currentMessage.objectInstanceId!,
        );

        repo.removeReaction(request)
            .then(() => {
                console.info('Reaction removed');
            })
            .catch(error => {
                console.error('Error removing reaction', error);
            });
        const userIds = participants.map(item => `${item.id}`);
        const payload: IUpdateMessageReactionPayload = {
            reactionData: {
                messageId: currentMessage._id,
                reaction: '',
                objectId: currentMessage.objectId!,
                objectInstanceId: currentMessage.objectInstanceId!,
            },
            user: {
                id: user.id,
                avatar: user.avatar,
                fullname: user.fullname,
            },
            actType: 'remove',
        };
        dispatch(updateMessageReactionActionTypes.startAction(payload));
        ChatHelper.shared.sendReactionEvent(userIds, payload);
    }, [dispatch, user, currentMessage, participants]);
};
