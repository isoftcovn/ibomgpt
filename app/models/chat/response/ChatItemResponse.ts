import dayjs, { Dayjs } from 'dayjs';

export class ChatItemResponse {
    lastCommentId?: number;
    lastCommentContent?: string;
    name: string;
    lastCommentCreatedDateDisplay?: string;
    lastCommentUpdatedDateDisplay?: string;
    lastCommentCreatedDate?: Dayjs;
    lastCommentUpdatedDate?: Dayjs;
    lastSenderName?: string;
    avatar?: string;
    objectId: number;
    objectInstanceId: number;
    companyId?: number;
    allowEdit?: boolean;
    allowDelete?: boolean;
    isRead: boolean;

    constructor() {
        this.name = '';
        this.objectId = 0;
        this.objectInstanceId = 0;
        this.isRead = false;
    }

    static parseFromJson = (data: any): ChatItemResponse => {
        const { comment_content, OBJECT_INSTANCE_NAME, comment_id, updated_date_view, object_id,
            avatar, created_date_view, company_id, object_instance_id, user_created_name, allow_del, allow_edit, is_read } = data;
        const dateFormat = 'DD/MM/YYYY h:mmA';
        const obj = new ChatItemResponse();
        obj.objectId = object_id ?? 0;
        obj.objectInstanceId = object_instance_id ?? 0;
        obj.name = OBJECT_INSTANCE_NAME ?? '';
        obj.lastCommentContent = comment_content;
        obj.lastCommentId = comment_id;
        obj.lastCommentCreatedDateDisplay = created_date_view;
        obj.lastCommentUpdatedDateDisplay = updated_date_view;
        obj.allowEdit = Boolean(allow_edit);
        obj.allowDelete = Boolean(allow_del);
        obj.isRead = Boolean(is_read);
        if (created_date_view) {
            const createdDateDisplay = created_date_view.trim().split(' ').filter((item: string) => item.trim().length > 0).join(' ').toUpperCase();
            const createdDate = dayjs(createdDateDisplay, dateFormat);
            obj.lastCommentCreatedDate = createdDate;
        }
        if (updated_date_view) {
            const updatedDateDisplay = updated_date_view.trim().split(' ').filter((item: string) => item.trim().length > 0).join(' ').toUpperCase();
            const date = dayjs(updatedDateDisplay, dateFormat);
            obj.lastCommentUpdatedDate = date;
        }
        obj.avatar = avatar;
        obj.companyId = company_id;
        obj.lastSenderName = user_created_name;
        return obj;
    };
}
