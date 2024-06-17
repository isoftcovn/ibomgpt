import {UserRepository} from '@data/repository/user';
import {AppStateStatus} from 'react-native';
import {BehaviorSubject, Subject} from 'rxjs';

class AppManager {
    appState = {
        credentialsReadyForAuth: false,
        credentialsReadyForUnauth: false,
    };
    appStateStatus: BehaviorSubject<AppStateStatus>;
    appFromBackgroundToForeground: Subject<Date>;
    appFromForegroundToBackground: Subject<Date>;

    forceSignout: Subject<string>;

    forceReauthoirze: Subject<Date>;

    constructor() {
        this.appStateStatus = new BehaviorSubject<AppStateStatus>('unknown');
        this.appFromBackgroundToForeground = new Subject<Date>();
        this.appFromForegroundToBackground = new Subject<Date>();
        this.forceSignout = new Subject<string>();
        this.forceReauthoirze = new Subject<Date>();
    }

    reauthorizeUser = async (user: string, pass: string) => {
        this.appState = {
            credentialsReadyForAuth: false,
            credentialsReadyForUnauth: false,
        };
        const userRepo = new UserRepository();
        await userRepo.saveUserCreds(user, pass);
        this.forceReauthoirze.next(new Date());
    };
}

export default new AppManager();
