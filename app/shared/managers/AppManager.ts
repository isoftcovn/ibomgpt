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

    constructor() {
        this.appStateStatus = new BehaviorSubject<AppStateStatus>('unknown');
        this.appFromBackgroundToForeground = new Subject<Date>();
        this.appFromForegroundToBackground = new Subject<Date>();
    }
}

export default new AppManager();
