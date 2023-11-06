import Config from 'react-native-config';
import { startNetworkLogging } from 'react-native-network-logger';

if (Config.ENABLE_DEVELOPER_CONSOLE == 'true' && Config.ENABLE_NETWORK_DEBUGGER == 'true') {
    startNetworkLogging({
        ignoredHosts: [
            'clients3.google.com',
        ],
    });
}
