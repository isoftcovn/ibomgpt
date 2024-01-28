import { AppStateStatus } from 'react-native';
import { BehaviorSubject, Subject } from 'rxjs';

class AppManager {
    appState = {
        credentialsReadyForAuth: false,
        credentialsReadyForUnauth: false,
    };
    appStateStatus: BehaviorSubject<AppStateStatus>;
    appFromBackgroundToForeground: Subject<Date>;
    appFromForegroundToBackground: Subject<Date>;

    forceSignout: Subject<string>;

    constructor() {
        this.appStateStatus = new BehaviorSubject<AppStateStatus>('unknown');
        this.appFromBackgroundToForeground = new Subject<Date>();
        this.appFromForegroundToBackground = new Subject<Date>();
        this.forceSignout = new Subject<string>();
    }
}

export default new AppManager();
