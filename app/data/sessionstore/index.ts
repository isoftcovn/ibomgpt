export class DataStore {
    static shared = new DataStore();

    accessToken?: string | null;
    refreshToken?: string | null;
    apiHost?: string | null;
    userAgent?: string | null;
    deviceUUID?: string | null;
    username?: string | null;

    private constructor() { }

    clearUserData = () => {
        this.accessToken = undefined;
        this.refreshToken = undefined;
        this.apiHost = undefined;
        this.username = undefined;
    }
}
