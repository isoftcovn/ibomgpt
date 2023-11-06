export class AppVersionResponse {
    versionName: string;
    mandatory: boolean;
    storeUrl?: string;

    constructor() {
        this.versionName = '';
        this.mandatory = false;
    }

    static parseFromResponse = (data: any): AppVersionResponse => {
        const obj = new AppVersionResponse();
        const { versionName, mandatory, storeUrl } = data;
        obj.versionName = versionName ?? '';
        obj.mandatory = mandatory ?? false;
        obj.storeUrl = storeUrl;
        return obj;
    };
}
