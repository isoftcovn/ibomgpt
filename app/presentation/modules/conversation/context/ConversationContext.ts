import { IAppChatMessage } from 'app/presentation/models/chat';
import React from 'react';
import { TextInput } from 'react-native';

export interface IConversationContext {
    editMessage?: IAppChatMessage;
    setEditMessage: (message: IAppChatMessage | undefined) => void;
    textInputRef: React.RefObject<TextInput>,
    objectId: number,
    objectInstanceId: number,
}

export interface IConversationInputContext {
    text: string;
    setText: (text: string) => void;
}

export const ConversationContext = React.createContext<IConversationContext>({
    editMessage: undefined,
    setEditMessage: (message?: IAppChatMessage) => { },
    textInputRef: React.createRef<TextInput>(),
    objectId: 0,
    objectInstanceId: 0,
});

export const ConversationInputContext = React.createContext<IConversationInputContext>({
    setText: () => { },
    text: '',
});
