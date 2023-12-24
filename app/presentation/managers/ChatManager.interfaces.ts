export interface ISignalRData {
    event: SignalREvent;
    payload: any;
    sentDeviceUID?: string;
}

export type SignalREvent = 'new-messages' | 'user-typing' | 'edit-message' | 'delete-message';

export type TypingState = 'typing' | 'ended';

export interface IUsersTypingPayload {
    userName: string;
    objectId: number;
    objectInstanceId: number;
    typingState:TypingState;
}

export interface IEditMessageSignalRPayload {
    objectId: number;
    objectInstanceId: number;
    messageId: string;
    content: string;
}

export interface IDeleteMessageSignalRPayload {
    objectId: number;
    objectInstanceId: number;
    messageId: string;
}
