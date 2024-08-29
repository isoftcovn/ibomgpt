export class AppVersionResponse {
    versionName: string;
    mandatory: boolean;
    isValid: boolean;
    storeUrl?: string;

    constructor() {
        this.versionName = '';
        this.mandatory = false;
        this.isValid = false;
    }

    static parseFromResponse = (data: any): AppVersionResponse => {
        const obj = new AppVersionResponse();
        const { version } = data;
        obj.versionName = data['Latest version of the application'] ?? '';
        obj.mandatory = true;
        obj.isValid = version;
        return obj;
    };
}
