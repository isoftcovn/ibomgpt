import { UploadFileRequestModel } from '@models/general/request/UploadFileRequestModel';

export type SubmitMode = 'submit' | 'edit' | 'delete';

export class SubmitMessageRequestModel {
    object_instance_id: number;
    object_id: number;
    mode: SubmitMode;
    comment_content: string;
    comment_id?: number;
    FileUpload?: UploadFileRequestModel[];

    constructor(object_id: number, object_instance_id: number, mode: SubmitMode, comment_content: string) {
        this.object_id = object_id;
        this.object_instance_id = object_instance_id;
        this.mode = mode;
        this.comment_content = comment_content;
    }
}
