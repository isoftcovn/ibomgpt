export class DataStore {
    static shared = new DataStore();

    accessToken?: string | null;
    refreshToken?: string | null;
    apiHost?: string | null;
    userAgent?: string | null;
    deviceUUID?: string | null;


    private constructor() {}
}