import analytics, { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';
import firebase from '@react-native-firebase/app';
import UserModel from 'app/models/user/response/UserModel';

class AnalyticsHelper {
    analytics: FirebaseAnalyticsTypes.Module;

    constructor() {
        this.analytics = analytics();
        if (firebase.app().utils().isRunningInTestLab) {
            this.analytics.setAnalyticsCollectionEnabled(false).catch();
        }
    }

    setCurrentScreen = (screenName: string, classOverride?: string) => {
        return this.analytics.logScreenView({
            screen_class: classOverride,
            screen_name: screenName,
        });
    };

    setUser = async (user: UserModel) => {
        this.analytics.setUserId(String(user.id)).catch();
        this.analytics.setUserProperties({
            username: user.email || '',
            email: user.email || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
        }).catch();
    };

    logEvent = (eventName: string, params?: any) => {
        return this.analytics.logEvent(eventName, params);
    };
}

export default new AnalyticsHelper();
