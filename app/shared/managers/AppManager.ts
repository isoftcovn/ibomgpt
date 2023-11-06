import { AppStateStatus } from 'react-native';
import { BehaviorSubject } from 'rxjs';

class AppManager {
    appState = {
        credentialsReadyForAuth: false,
        credentialsReadyForUnauth: false,
    };
    appStateStatus: BehaviorSubject<AppStateStatus>;

    constructor() {
        this.appStateStatus = new BehaviorSubject<AppStateStatus>('unknown');
    }
}

export default new AppManager();
