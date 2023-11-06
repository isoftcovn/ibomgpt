import crashlytics, { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics';
import UserModel from 'app/models/user/response/UserModel';

class CrashlyticsHelper {
    crashlytics: FirebaseCrashlyticsTypes.Module;

    constructor() {
        this.crashlytics = crashlytics();
    }

    recordError = (error: Error) => {
        this.crashlytics.recordError(error);
    };

    setUser = (user: UserModel) => {
        this.crashlytics.setUserId(String(user.id)).catch();
        this.crashlytics.setAttributes({
            email: user.email || '',
        }).catch(console.error);
    };
}

export default new CrashlyticsHelper();
