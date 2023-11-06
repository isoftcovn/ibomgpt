import { AppVersionResponse } from './AppVersionModel';

export class AppConfigurationResponse {
    iosVersion: AppVersionResponse;
    androidVersion: AppVersionResponse;

    constructor() {
        this.iosVersion = new AppVersionResponse();
        this.androidVersion = new AppVersionResponse();
    }

    static parseFromResponse = (data: any): AppConfigurationResponse => {
        const obj = new AppConfigurationResponse();
        const {iosVersion, androidVersion} = data;
        obj.iosVersion = AppVersionResponse.parseFromResponse(iosVersion);
        obj.androidVersion = AppVersionResponse.parseFromResponse(androidVersion);
        return obj;
    };
}
