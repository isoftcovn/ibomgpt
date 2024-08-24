import UserModel from '@models/user/response/UserModel';

export class ChatRoomsOptions {
    allowAddNewMessage: boolean;
    allowAttachFiles: boolean;
    participants?: UserModel[];
    name: string;
    infoHTML?: string;

    constructor() {
        this.allowAddNewMessage = false;
        this.allowAttachFiles = false;
        this.name = '';
    }

    static parseFromJson = (data: any): ChatRoomsOptions => {
        const {
            allow_add_new,
            allow_attach,
            userList,
            OBJECT_INSTANCE_NAME,
            OBJECT_INFO,
        } = data;
        const obj = new ChatRoomsOptions();
        obj.name = OBJECT_INSTANCE_NAME ?? '';
        obj.infoHTML = OBJECT_INFO;
        obj.allowAddNewMessage = Boolean(allow_add_new);
        obj.allowAttachFiles = Boolean(allow_attach);
        if (userList && Array.isArray(userList)) {
            obj.participants = userList.map(UserModel.parseFromChatResponse);
        }
        return obj;
    };
}
