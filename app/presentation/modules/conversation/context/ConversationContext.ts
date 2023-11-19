import { IAppChatMessage } from 'app/presentation/models/chat';
import React from 'react';

export interface IConversationContext {
    editMessage?: IAppChatMessage;
    setEditMessage: (message: IAppChatMessage | undefined) => void;
}

export interface IConversationInputContext {
    text: string;
    setText: (text: string) => void;
}

export const ConversationContext = React.createContext<IConversationContext>({
    editMessage: undefined,
    setEditMessage: (message?: IAppChatMessage) => { }
});

export const ConversationInputContext = React.createContext<IConversationInputContext>({
    setText: () => {},
    text: '',
});
