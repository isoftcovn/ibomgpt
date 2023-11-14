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

export const selectLatestMessageByKey = createSelector(
    [
        (state: any): Record<string, IAppChatMessage[]> | undefined => selectMessagesState(state).data,
        (state: any, key: string): string => key,
    ],
    (groupMessages, key): IAppChatMessage | undefined => {
        const messages = groupMessages?.[key] ?? [];
        return messages[0];
    }
);

export const selectMessagesCanLoadMoreByKey = createSelector(
    [
        (state: any): Record<string, boolean> | undefined => selectMessagesState(state).canLoadMore,
        (state: any, key: string): string => key,
    ],
    (canLoadMore, key): boolean => {
        return canLoadMore?.[key] ?? true;
    }
);

export const selectMessagesFetchingState = createSelector(
    (state: any): any => selectMessagesState(state),
    (state): boolean => {
        return state.isFetching;
    }
);
