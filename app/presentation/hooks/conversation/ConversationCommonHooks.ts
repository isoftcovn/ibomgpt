import { IAppChatMessage } from 'app/presentation/models/chat';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useLatestMessageContent = (message?: IAppChatMessage): string => {
    const { t } = useTranslation();
    return useMemo(() => {
        if (!message) { return ''; }
        if (message.text && message.text.length > 0) {
            return message.text;
        }
        if (message.image && message.image.length > 0) {
            return t('sentAnImage');
        }
        if (message.video && message.video.length > 0) {
            return t('sentAVideo');
        }
        if ((message.audio && message.audio.length > 0) || (message.fileUrl && message.fileUrl.length > 0)) {
            return t('sentAFile');
        }

        return '';
    }, [message, t]);
};