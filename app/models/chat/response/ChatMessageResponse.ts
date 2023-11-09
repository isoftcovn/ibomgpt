export class ChatMessageFileResponse {
    id: number;
    fileUrl: string;
    extension?: string;

    constructor() {
        this.id = 0;
        this.fileUrl = '';
    }

    static parseFromJson = (data: any): ChatMessageFileResponse => {
        const { file_id, file_path, extension } = data;
        const obj = new ChatMessageFileResponse();
        obj.id = file_id ?? 0;
        obj.fileUrl = file_path ?? '';
        obj.extension = extension;
        return obj;
    };
}


export class ChatMessageResponse {
    senderId: number;
    senderName: string;
    id: number;
    sentDateDisplay: string;
    updatedDateDisplay?: string;
    objectId: number;
    objectInstanceId: number;
    avatar?: string;
    content?: string;
    fileList: ChatMessageFileResponse[];

    constructor() {
        this.id = 0;
        this.senderId = 0;
        this.senderName = '';
        this.sentDateDisplay = '';
        this.objectId = 0;
        this.objectInstanceId = 0;
        this.fileList = [];
    }

    static parseFromJson = (data: any): ChatMessageResponse => {
        const { created_by, comment_content, comment_id, user_created_name, updated_date_view,
            object_id, created_date_view, object_instance_id, fileList } = data;
        const obj = new ChatMessageResponse();
        obj.id = comment_id ?? 0;
        obj.senderId = created_by ?? 0;
        obj.senderName = user_created_name ?? '';
        obj.sentDateDisplay = created_date_view ?? '';
        obj.updatedDateDisplay = updated_date_view;
        obj.objectId = object_id ?? 0;
        obj.objectInstanceId = object_instance_id ?? 0;
        obj.content = comment_content;
        if (fileList && Array.isArray(fileList)) {
            obj.fileList = fileList.map((item: any) => ChatMessageFileResponse.parseFromJson(item));
        }
        return obj;
    };
}
