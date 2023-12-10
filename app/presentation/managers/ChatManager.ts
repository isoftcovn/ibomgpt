import signalR from '@microsoft/signalr';
import { MessageHelper } from '@shared/helper/MessageHelper';
import Config from 'react-native-config';
import { IChatMessage } from 'react-native-gifted-chat';
import { Subject } from 'rxjs';

export class ChatManager {
    static shared = new ChatManager();

    connection?: signalR.HubConnection;
    receiveMessageEvent: Subject<IChatMessage[]>;
    private constructor() {
        this.receiveMessageEvent = new Subject<IChatMessage[]>();
    }

    _onReceivedMessage = (data: any) => {
        console.log('receive raw message: ', data);
        // TODO: Convert to app message
        const messages = MessageHelper.shared.convertMessageResponseToChatMessage(data);
        this.receiveMessageEvent.next(messages);
    };

    startConnection = () => {
        let connection = new signalR.HubConnectionBuilder()
            .withUrl(Config.SIGNALR_URL)
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
}
