import * as signalR from '@microsoft/signalr';
import { ChatMessageResponse } from '@models/chat/response/ChatMessageResponse';
import { MessageHelper } from '@shared/helper/MessageHelper';
import { IChatMessage } from 'react-native-gifted-chat';
import { Subject } from 'rxjs';
import DeviceInfo from 'react-native-device-info';
import { ISignalRData, IUsersTypingPayload, TypingState } from './ChatManager.interfaces';

export class ChatManager {
    static shared = new ChatManager();

    _chathubURI?: string;
    _deviceUID?: string;

    channelTypingState: Record<string, TypingState>;

    connection?: signalR.HubConnection;
    receiveMessageEvent: Subject<IChatMessage[]>;
    userTypingEvent: Subject<IUsersTypingPayload>;
    private constructor() {
        this.receiveMessageEvent = new Subject<IChatMessage[]>();
        this.userTypingEvent = new Subject<IUsersTypingPayload>();
        this.channelTypingState = {};

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
                const message = data.payload as ChatMessageResponse | undefined;
                const isValidMessagePayload = message && message.id && message.objectId && message.objectInstanceId;
                return isValidMessagePayload && !isSentByThisDevice;
            case 'user-typing':
                const typingData = data.payload as IUsersTypingPayload | undefined;
                return typingData && typingData.userName && typingData.typingState && !isSentByThisDevice;
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
                    const messages = MessageHelper.shared.convertMessageResponseToChatMessage(data.payload);
                    console.log('receive converted messages: ', messages);
                    this.receiveMessageEvent.next(messages);
                    break;
                case 'user-typing':
                    const typingData = data.payload as IUsersTypingPayload;
                    console.log('receive user typing: ', typingData);
                    this.userTypingEvent.next(typingData);
                    break;
            }
        }
    };

    sendMessageToUsers = (userIds: string[], payload: ISignalRData) => {
        this.connection?.invoke('SendMessageToUsers', userIds, JSON.stringify(payload)).then(() => {
            console.log('Invoke send messages done: ', userIds);
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
