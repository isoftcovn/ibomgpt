export class UploadFileRequestModel {
    /**
     * File uri
     */
    uri: string;
    name: string;
    /**
     * Mime of file
     */
    type: string;

    constructor(uri: string, name: string, type: string) {
        this.uri = uri;
        this.name = name;
        this.type = type;
    }
}
