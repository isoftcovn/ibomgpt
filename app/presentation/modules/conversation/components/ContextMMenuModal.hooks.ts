import GeneratedImages from '@assets/GeneratedImages';
import {selectUserId} from '@redux/selectors/user';
import {theme} from '@theme/index';
import {IAppChatMessage} from 'app/presentation/models/chat';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {ContextMenuActionButtonModel} from './ContextMenuModal.model';
import {useCallback, useContext, useMemo} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {ConversationContext} from '../context/ConversationContext';
import {deleteMessageActionTypes} from '@redux/actions/conversation';

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
