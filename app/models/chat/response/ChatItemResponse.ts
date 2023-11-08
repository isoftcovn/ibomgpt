export class ChatItemResponse {
    lastCommentId?: number;
    lastCommentContent?: string;
    name: string;
    lastCommentCreatedDateDisplay?: string;
    lastCommentUpdatedDateDisplay?: string;
    lastSenderName?: string;
    avatar?: string;
    objectId: number;
    objectInstanceId: number;
    companyId?: number;

    constructor() {
        this.name = '';
        this.objectId = 0;
        this.objectInstanceId = 0;
    }

    static parseFromJson = (data: any): ChatItemResponse => {
        const { comment_content, OBJECT_INSTANCE_NAME, comment_id, updated_date_view, object_id,
            avatar, created_date_view, company_id, object_instance_id, user_created_name } = data;
        const obj = new ChatItemResponse();
        obj.objectId = object_id ?? 0;
        obj.objectInstanceId = object_instance_id ?? 0;
        obj.name = OBJECT_INSTANCE_NAME ?? '';
        obj.lastCommentContent = comment_content;
        obj.lastCommentId = comment_id;
        obj.lastCommentCreatedDateDisplay = created_date_view;
        obj.lastCommentUpdatedDateDisplay = updated_date_view;
        obj.avatar = avatar;
        obj.companyId = company_id;
        obj.lastSenderName = user_created_name;
        return obj;
    };
}
