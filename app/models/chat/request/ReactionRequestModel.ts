export class ReactionRequestModel {
    react: string;
    comment_id: number | string;
    object_id: number;
    object_instance_id: number;

    constructor(
        react: string,
        comment_id: number | string,
        object_id: number,
        object_instance_id: number,
    ) {
        this.react = react;
        this.comment_id = comment_id;
        this.object_id = object_id;
        this.object_instance_id = object_instance_id;
    }
}
