export class UndoReactionRequestModel {
    comment_id: number | string;
    object_id: number;
    object_instance_id: number;
    act_type = -1;

    constructor(
        comment_id: number | string,
        object_id: number,
        object_instance_id: number,
    ) {
        this.comment_id = comment_id;
        this.object_id = object_id;
        this.object_instance_id = object_instance_id;
    }
}
