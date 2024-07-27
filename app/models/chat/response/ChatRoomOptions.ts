export class ChatRoomsOptions {
    allowAddNewMessage: boolean;
    allowAttachFiles: boolean;

    constructor() {
        this.allowAddNewMessage = false;
        this.allowAttachFiles = false;
    }

    static parseFromJson = (data: any): ChatRoomsOptions => {
        const {allow_add_new, allow_attach} = data;
        const obj = new ChatRoomsOptions();
        obj.allowAddNewMessage = Boolean(allow_add_new);
        obj.allowAttachFiles = Boolean(allow_attach);
        return obj;
    };
}
