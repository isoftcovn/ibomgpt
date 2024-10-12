export interface ISignalRData {
    event: SignalREvent;
    payload: any;
    sentDeviceUID?: string;
}

export type SignalREvent =
    | 'new-messages'
    | 'user-typing'
    | 'edit-message'
    | 'delete-message'
    | 'reaction';

export type TypingState = 'typing' | 'ended';

export class UsersTypingPayload {
    userName: string;
    objectId: number;
    objectInstanceId: number;
    typingState: TypingState;

    constructor() {
        this.userName = '';
        this.objectId = 0;
        this.objectInstanceId = 0;
        this.typingState = 'ended';
    }

    static parseData = (data: any): UsersTypingPayload => {
        const {
            userName,
            objectId,
            object_id,
            objectInstanceId,
            object_instance_id,
            typingState,
        } = data;
        const obj = new UsersTypingPayload();
        obj.objectId = objectId || object_id;
        obj.objectInstanceId = objectInstanceId || object_instance_id;
        obj.userName = userName;
        obj.typingState = typingState;
        return obj;
    };
}

export class EditMessageSignalRPayload {
    objectId: number;
    objectInstanceId: number;
    messageId: string;
    content: string;

    constructor() {
        this.objectId = 0;
        this.objectInstanceId = 0;
        this.messageId = '';
        this.content = '';
    }

    static parseData = (data: any): EditMessageSignalRPayload => {
        const {
            objectId,
            object_id,
            objectInstanceId,
            object_instance_id,
            commentId,
            comment_id,
            content,
        } = data;
        const obj = new EditMessageSignalRPayload();
        obj.objectId = objectId || object_id;
        obj.objectInstanceId = objectInstanceId || object_instance_id;
        obj.messageId = commentId || comment_id;
        obj.content = content;
        return obj;
    };
}

export class DeleteMessageSignalRPayload {
    objectId: number;
    objectInstanceId: number;
    messageId: string;

    constructor() {
        this.objectId = 0;
        this.objectInstanceId = 0;
        this.messageId = '';
    }

    static parseData = (data: any): DeleteMessageSignalRPayload => {
        const {
            objectId,
            object_id,
            objectInstanceId,
            object_instance_id,
            commentId,
            comment_id,
        } = data;
        const obj = new DeleteMessageSignalRPayload();
        obj.objectId = objectId || object_id;
        obj.objectInstanceId = objectInstanceId || object_instance_id;
        obj.messageId = commentId || comment_id;
        return obj;
    };
}
