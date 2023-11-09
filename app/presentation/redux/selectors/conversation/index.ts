import { IAppChatMessage } from 'app/presentation/models/chat';
import { createSelector } from 'reselect';

export const selectConversationState = createSelector(
    (state: any) => state.conversation,
    conversation => conversation
);

export const selectMessagesState = createSelector(
    (state: any) => selectConversationState(state),
    (conversation: any) => conversation.messages
);

export const selectMessagesByKey = createSelector(
    [
        (state: any): Record<string, IAppChatMessage[]> | undefined => selectMessagesState(state).data,
        (state: any, key: string): string => key,
    ],
    (groupMessages, key): IAppChatMessage[] => {
        return groupMessages?.[key] ?? [];
    }
);