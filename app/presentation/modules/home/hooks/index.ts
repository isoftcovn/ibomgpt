import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';
import { selectMessagesState } from '@redux/selectors/conversation';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useConversations = (conversations: ChatItemResponse[]) => {
    const allMessages: Record<string, IAppChatMessage[]> = useSelector(selectMessagesState).data;
    return useMemo(() => {
        return conversations.sort((a, b) => {
            const aMessages = allMessages[`${a.objectId}-${a.objectInstanceId}`] ?? [];
            const bMessages = allMessages[`${b.objectId}-${b.objectInstanceId}`] ?? [];
            const aLatestMessage = aMessages[0];
            const bLatestMessage = bMessages[0];
            let aTimestamp = 0;
            let bTimestamp = 0;
            if (aLatestMessage) {
                aTimestamp = (aLatestMessage.createdAt as Date).getTime();
            } else {
                aTimestamp = a.lastCommentUpdatedDate?.unix() ?? 0;
            }

            if (bLatestMessage) {
                bTimestamp = (bLatestMessage.createdAt as Date).getTime();
            } else {
                bTimestamp = b.lastCommentUpdatedDate?.unix() ?? 0;
            }

            return bTimestamp - aTimestamp;
        });
    }, [conversations, allMessages]);
};
