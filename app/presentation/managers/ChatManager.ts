import * as signalR from '@microsoft/signalr';
import { MessageHelper } from '@shared/helper/MessageHelper';
import { IChatMessage } from 'react-native-gifted-chat';
import { Subject } from 'rxjs';

export class ChatManager {
    static shared = new ChatManager();

    _chathubURI?: string;

    connection?: signalR.HubConnection;
    receiveMessageEvent: Subject<IChatMessage[]>;
    private constructor() {
        this.receiveMessageEvent = new Subject<IChatMessage[]>();
    }

    _onReceivedMessage = (data: any) => {
        console.log('receive raw message: ', data);
        // TODO: Convert to app message
        const messages = MessageHelper.shared.convertMessageResponseToChatMessage(data);
        console.log('receive converted messages: ', messages);
        this.receiveMessageEvent.next(messages);
    };

    sendMessageToUsers = (userIds: string[], payload: any) => {
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
