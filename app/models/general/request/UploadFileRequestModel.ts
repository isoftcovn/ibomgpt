export default class UploadFileRequestModel {
    /**
     * File uri
     */
    image: string;
    name: string;
    /**
     * Mime of file
     */
    type: string;

    constructor(imageUri: string, name: string, type: string) {
        this.image = imageUri;
        this.name = name;
        this.type = type;
    }
}
