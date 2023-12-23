export interface ISignalRData {
    event: SignalREvent;
    payload: any;
    sentDeviceUID?: string;
}

export type SignalREvent = 'new-messages' | 'user-typing';

export type TypingState = 'typing' | 'ended';

export interface IUsersTypingPayload {
    userName: string;
    objectId: number;
    objectInstanceId: number;
    typingState:TypingState;
}
