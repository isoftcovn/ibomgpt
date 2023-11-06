import { NetInfoState } from '@react-native-community/netinfo';

export default class ConnectionManager {

    static connectionStatus?: NetInfoState;

    static setConnectionStatus = (connectionStatus: NetInfoState) => {
        ConnectionManager.connectionStatus = connectionStatus;
    };

    static isConnected = () => {
        return ConnectionManager.connectionStatus && ConnectionManager.connectionStatus.isConnected;
    };

}
