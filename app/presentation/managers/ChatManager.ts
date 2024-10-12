import * as signalR from '@microsoft/signalr';
import {ChatMessageResponse} from '@models/chat/response/ChatMessageResponse';
import {MessageHelper} from '@shared/helper/MessageHelper';
import {IChatMessage} from 'react-native-gifted-chat';
import {Subject} from 'rxjs';
import DeviceInfo from 'react-native-device-info';
import {
    DeleteMessageSignalRPayload,
    EditMessageSignalRPayload,
    ISignalRData,
    TypingState,
    UsersTypingPayload,
} from './ChatManager.interfaces';
import {IAppChatMessage} from '../models/chat';
import {UserReactionResponse} from '@models/chat/response/UserReactionResponse';
import {IUpdateMessageReactionPayload} from '@redux/actions/conversation';

export class ChatManager {
    static shared = new ChatManager();

    _chathubURI?: string;
    _deviceUID?: string;

    currentConversationInfo = {
        objectId: 0,
        objectInstanceId: 0,
    };

    channelTypingState: Record<string, TypingState>;

    connection?: signalR.HubConnection;
    receiveMessageEvent: Subject<IChatMessage[]>;
    userTypingEvent: Subject<UsersTypingPayload>;
    editMessageEvent: Subject<EditMessageSignalRPayload>;
    deleteMessageEvent: Subject<DeleteMessageSignalRPayload>;
    reactionEvent: Subject<IUpdateMessageReactionPayload>;

    messageSentEvent: Subject<IAppChatMessage[]>;

    private constructor() {
        this.receiveMessageEvent = new Subject<IChatMessage[]>();
        this.userTypingEvent = new Subject<UsersTypingPayload>();
        this.editMessageEvent = new Subject<EditMessageSignalRPayload>();
        this.deleteMessageEvent = new Subject<DeleteMessageSignalRPayload>();
        this.reactionEvent = new Subject<IUpdateMessageReactionPayload>();
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
                const isValidMessagePayload =
                    message &&
                    message.id &&
                    message.objectId &&
                    message.objectInstanceId;
                return isValidMessagePayload && !isSentByThisDevice;
            case 'user-typing':
                const typingData = data.payload
                    ? UsersTypingPayload.parseData(data.payload)
                    : undefined;
                return (
                    typingData &&
                    typingData.userName &&
                    typingData.typingState &&
                    !isSentByThisDevice
                );
            case 'edit-message':
                const editEventData = data.payload
                    ? EditMessageSignalRPayload.parseData(data.payload)
                    : undefined;
                return (
                    editEventData &&
                    editEventData.messageId &&
                    !isSentByThisDevice
                );
            case 'delete-message':
                const deleteEventData = data.payload
                    ? DeleteMessageSignalRPayload.parseData(data.payload)
                    : undefined;
                console.info('deleteEventData: ', deleteEventData);
                return (
                    deleteEventData &&
                    deleteEventData.messageId &&
                    !isSentByThisDevice
                );
            case 'reaction':
                const reactionData = data.payload as
                    | IUpdateMessageReactionPayload
                    | undefined;
                return reactionData?.reactionData && !isSentByThisDevice;
        }
        return false;
    };

    _onReceivedMessage = (user: string, dataString: string) => {
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
                    messages =
                        MessageHelper.shared.convertMessageResponseToChatMessage(
                            payload,
                        );
                    console.info('receive converted messages: ', messages);
                    this.receiveMessageEvent.next(messages);
                    break;
                case 'user-typing':
                    const typingData = data.payload
                        ? UsersTypingPayload.parseData(data.payload)
                        : undefined;
                    console.info('receive user typing: ', typingData);
                    if (typingData) {
                        this.userTypingEvent.next(typingData);
                    }
                    break;
                case 'edit-message':
                    const editEventData = data.payload
                        ? EditMessageSignalRPayload.parseData(data.payload)
                        : undefined;
                    console.info('edit mmessage event: ', editEventData);
                    if (editEventData) {
                        this.editMessageEvent.next(editEventData);
                    }
                    break;
                case 'delete-message':
                    const deleteEventData = data.payload
                        ? DeleteMessageSignalRPayload.parseData(data.payload)
                        : undefined;
                    console.info('delete mmessage event: ', deleteEventData);
                    if (deleteEventData) {
                        this.deleteMessageEvent.next(deleteEventData);
                    }
                    break;
                case 'reaction':
                    const reactionData = data.payload as
                        | IUpdateMessageReactionPayload
                        | undefined;
                    if (reactionData) {
                        console.info('receive reaction: ', reactionData);
                        this.reactionEvent.next(reactionData);
                    }
                    break;
            }
        }
    };

    sendMessageToUsers = (userIds: string[], payload: ISignalRData) => {
        this.connection
            ?.invoke('SendMessageToUsers', userIds, JSON.stringify(payload))
            .catch(error => {
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

        connection.onclose(error => {
            if (error) {
                console.error('SignalR close with error: ', error);
            } else {
                console.info('SignalR closed');
            }
        });

        connection.onreconnecting(error => {
            if (error) {
                console.error('SignalR is reconnecting with error: ', error);
            } else {
                console.info('SignalR is reconnecting');
            }
        });

        connection.onreconnected(error => {
            if (error) {
                console.error('SignalR is reconnected with error: ', error);
            } else {
                console.info('SignalR is reconncted');
            }
        });

        connection.on('ReceiveMessage', this._onReceivedMessage);

        connection
            .start()
            .then(() => {
                console.info('SignalR connected');
            })
            .catch(error => {
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
