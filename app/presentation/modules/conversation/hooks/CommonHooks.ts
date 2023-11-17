import Clipboard from '@react-native-clipboard/clipboard';
import { selectUserId } from '@redux/selectors/user';
import DropDownHolder from '@shared/helper/DropdownHolder';
import { theme } from '@theme/index';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export const useOnMessageLongPress = () => {
    const userId = useSelector(selectUserId);
    const { t } = useTranslation();

    const onMessageLongPress = useCallback((context: any, currentMessage: IAppChatMessage) => {
        // eslint-disable-next-line eqeqeq
        const isMyMessage = currentMessage.user._id == userId;
        const options: string[] = [];
        if (currentMessage.text) {
            options.push(t('copy'));
        }
        if (isMyMessage) {
            options.push(t('edit'), t('delete'),);
        }
        options.push(t('cancel'));
        const cancelButtonIndex = options.length - 1;
        context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveColor: theme.color.danger,
                destructiveButtonIndex: isMyMessage ? 2 : undefined,
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
                            console.log('Edit message');
                        }
                        break;
                    case t('delete'):
                        // delete
                        if (isMyMessage) {
                            console.log('Delete message');
                        }
                        break;
                }
            });
    }, [userId, t]);

    return {
        onMessageLongPress
    };
};
