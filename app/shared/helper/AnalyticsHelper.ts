import analytics, { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';
import firebase from '@react-native-firebase/app';
import UserModel from 'app/models/user/response/UserModel';
import { OneSignal } from 'react-native-onesignal';

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
            fullname: user.fullname ?? '',
        }).catch();
        OneSignal.login(`${user.id}`);
        if (user.email) {
            OneSignal.User.addEmail(user.email);
            OneSignal.User.addTag('emailAddress', user.email);
        }
    };

    logEvent = (eventName: string, params?: any) => {
        return this.analytics.logEvent(eventName, params);
    };
}

export default new AnalyticsHelper();
