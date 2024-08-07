import * as signalR from '@microsoft/signalr';
import { ChatMessageResponse } from '@models/chat/response/ChatMessageResponse';
import { MessageHelper } from '@shared/helper/MessageHelper';
import { IChatMessage } from 'react-native-gifted-chat';
import { Subject } from 'rxjs';
import DeviceInfo from 'react-native-device-info';
import { ISignalRData, IUsersTypingPayload, IDeleteMessageSignalRPayload, IEditMessageSignalRPayload, TypingState } from './ChatManager.interfaces';
import { IAppChatMessage } from '../models/chat';

export class ChatManager {
    static shared = new ChatManager();

    _chathubURI?: string;
    _deviceUID?: string;

    currentConversationInfo = {
        objectId: 0,
        objectInstanceId: 0
    };

    channelTypingState: Record<string, TypingState>;

    connection?: signalR.HubConnection;
    receiveMessageEvent: Subject<IChatMessage[]>;
    userTypingEvent: Subject<IUsersTypingPayload>;
    editMessageEvent: Subject<IEditMessageSignalRPayload>;
    deleteMessageEvent: Subject<IDeleteMessageSignalRPayload>;

    messageSentEvent: Subject<IAppChatMessage[]>;

    private constructor() {
        this.receiveMessageEvent = new Subject<IChatMessage[]>();
        this.userTypingEvent = new Subject<IUsersTypingPayload>();
        this.editMessageEvent = new Subject<IEditMessageSignalRPayload>();
        this.deleteMessageEvent = new Subject<IDeleteMessageSignalRPayload>();
        this.channelTypingState = {};
        this.messageSentEvent = new Subject<IAppChatMessage[]>();

        DeviceInfo.getUniqueId().then(id => {
            this._deviceUID = id;
        });
    }

    _isValidMessage = (data: ISignalRData) => {
        const event = data.event;
        if (!event) {
            return false;
        }
        const isSentByThisDevice = data?.sentDeviceUID === this._deviceUID;
        switch (event) {
            case 'new-messages':
                const payload = data.payload;
                const isRawPayload = Boolean(payload?.comment_id);
                let message = data.payload as ChatMessageResponse | undefined;
                if (isRawPayload) {
                    message = ChatMessageResponse.parseFromJson(payload);
                }
                const isValidMessagePayload = message && message.id && message.objectId && message.objectInstanceId;
                return isValidMessagePayload && !isSentByThisDevice;
            case 'user-typing':
                const typingData = data.payload as IUsersTypingPayload | undefined;
                return typingData && typingData.userName && typingData.typingState && !isSentByThisDevice;
            case 'edit-message':
                const editEventData = data.payload as IEditMessageSignalRPayload | undefined;
                return editEventData && editEventData.messageId && !isSentByThisDevice;
            case 'delete-message':
                const deleteEventData = data.payload as IDeleteMessageSignalRPayload | undefined;
                return deleteEventData && deleteEventData.messageId && !isSentByThisDevice;
        }
        return false;
    };

    _onReceivedMessage = (user: string, dataString: string) => {
        console.log('receive raw data: ', user, dataString);
        const data = JSON.parse(dataString) as ISignalRData;
        if (this._isValidMessage(data)) {
            const event = data.event;
            switch (event) {
                case 'new-messages':
                    const isRawPayload = Boolean(data.payload.comment_id);
                    let payload: ChatMessageResponse = data.payload;
                    let messages: IAppChatMessage[] = [];
                    if (isRawPayload) {
                        payload = ChatMessageResponse.parseFromJson(payload);
                    }
                    messages = MessageHelper.shared.convertMessageResponseToChatMessage(payload);
                    console.log('receive converted messages: ', messages);
                    this.receiveMessageEvent.next(messages);
                    break;
                case 'user-typing':
                    const typingData = data.payload as IUsersTypingPayload;
                    console.log('receive user typing: ', typingData);
                    this.userTypingEvent.next(typingData);
                    break;
                case 'edit-message':
                    const editMessagegData = data.payload as IEditMessageSignalRPayload;
                    console.log('edit mmessage event: ', editMessagegData);
                    this.editMessageEvent.next(editMessagegData);
                    break;
                case 'delete-message':
                    const deleteMessagegData = data.payload as IDeleteMessageSignalRPayload;
                    console.log('delete mmessage event: ', deleteMessagegData);
                    this.deleteMessageEvent.next(deleteMessagegData);
                    break;
            }
        }
    };

    sendMessageToUsers = (userIds: string[], payload: ISignalRData) => {
        this.connection?.invoke('SendMessageToUsers', userIds, JSON.stringify(payload)).then(() => {
            console.log('Invoke send messages done');
        }).catch(error => {
            console.error('Invoke send messages error: ', error);
        });
    };

    startConnection = (userId: string) => {
        if (!this._chathubURI) {
            console.error('Please config chathubURI first');
            return;
        }
        const uri = `${this._chathubURI}chatHub?username=${userId}`;
        console.info('Chathub uri: ', uri);
        let connection = new signalR.HubConnectionBuilder()
            .withUrl(uri)
            .configureLogging(signalR.LogLevel.Debug)
            .withAutomaticReconnect()
            .build();
        this.connection = connection;

        connection.onclose((error) => {
            if (error) {
                console.error('SignalR close with error: ', error);
            } else {
                console.info('SignalR closed');
            }
        });

        connection.onreconnecting((error) => {
            if (error) {
                console.error('SignalR is reconnecting with error: ', error);
            } else {
                console.info('SignalR is reconnecting');
            }
        });

        connection.onreconnected((error) => {
            if (error) {
                console.error('SignalR is reconnected with error: ', error);
            } else {
                console.info('SignalR is reconncted');
            }
        });

        connection.on('ReceiveMessage', this._onReceivedMessage);

        connection.start().then(() => {
            console.info('SignalR connected');
        }).catch(error => {
            console.warn('Connect to signalr failed: ', error);
        });
    };

    stopConnection = () => {
        this.connection?.off('ReceiveMessage');
        this.connection?.stop();
    };

    storeChatHubURI = (uri: string) => {
        this._chathubURI = uri;
    };
}
