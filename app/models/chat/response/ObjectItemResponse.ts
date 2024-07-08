export class ObjectItemResponse {
    rowInfo?: string;
    objectId: number;
    objectInstanceId: number;

    constructor() {
        this.objectId = 0;
        this.objectInstanceId = 0;
    }

    static parseFromJson = (data: any): ObjectItemResponse => {
        const obj = new ObjectItemResponse();
        const {info, object_id, object_instance_id} = data;
        obj.rowInfo = info;
        obj.objectId = Number(object_id);
        obj.objectInstanceId = Number(object_instance_id);
        return obj;
    };
}
