import { store } from '@redux/store';
import AppManager from '@shared/managers/AppManager';
import React, { useEffect } from 'react';
import { DeviceEventEmitter, LogBox } from 'react-native';
import Config from 'react-native-config';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import RootContainer from './RootContainer';

enableScreens();

interface Props {

}

LogBox.ignoreAllLogs();


const App = React.memo((props: Props) => {

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('credentialsReadyForAuth', () => {
            AppManager.appState.credentialsReadyForAuth = true;
        });

        const unauthSubscription = DeviceEventEmitter.addListener('credentialsReadyForUnauth', () => {
            AppManager.appState.credentialsReadyForUnauth = true;
        });

        return () => {
            subscription.remove();
            unauthSubscription.remove();
        };
    });

    console.log('API_URL: ', Config.API_URL);

    return <Provider store={store}>
        <RootContainer />
    </Provider>;
});

export default App;
