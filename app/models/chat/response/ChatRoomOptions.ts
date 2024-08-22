import UserModel from '@models/user/response/UserModel';

export class ChatRoomsOptions {
    allowAddNewMessage: boolean;
    allowAttachFiles: boolean;
    participants?: UserModel[];

    constructor() {
        this.allowAddNewMessage = false;
        this.allowAttachFiles = false;
    }

    static parseFromJson = (data: any): ChatRoomsOptions => {
        const {allow_add_new, allow_attach, userList} = data;
        const obj = new ChatRoomsOptions();
        obj.allowAddNewMessage = Boolean(allow_add_new);
        obj.allowAttachFiles = Boolean(allow_attach);
        if (userList && Array.isArray(userList)) {
            obj.participants = userList.map(UserModel.parseFromChatResponse);
        }
        return obj;
    };
}
