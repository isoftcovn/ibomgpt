export class ChatMessagesRequestModel {
    is_older: number; // 0: Load newer messages from last_id, 1: Load older messages from last_id
    last_id?: number;
    object_instance_id: number;
    object_id: number;

    constructor(object_id: number, object_instance_id: number, is_older: 0 | 1) {
        this.object_id = object_id;
        this.object_instance_id = object_instance_id;
        this.is_older = is_older;
    }
}
