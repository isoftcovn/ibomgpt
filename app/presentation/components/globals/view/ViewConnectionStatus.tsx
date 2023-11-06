import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';
import ConnectionManager from '@shared/managers/ConnectionManager';
import DropdownHolder from 'app/shared/helper/DropdownHolder';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ViewConnectionStatus = React.memo((props: any) => {
    const _isConnected = useRef(false);
    const _subscription = useRef<NetInfoSubscription>();
    const {t} = useTranslation();

    const _handleConnectivityChange = useCallback((state: NetInfoState) => {
        console.warn('connectivity change', state);

        _isConnected.current = !!state.isConnected;

        if (!_isConnected.current) {
            DropdownHolder.showErrorAlert(t('lostInternetConnection'));
        }

        ConnectionManager.setConnectionStatus(state);
    }, [t]);

    useEffect(() => {
        _subscription.current = NetInfo.addEventListener(_handleConnectivityChange);
        return () => {
            _subscription.current?.();
        };
    }, [_handleConnectivityChange]);

    return null;
});

export default ViewConnectionStatus;
