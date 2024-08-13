import {PossibleDeepLinkRoutes} from '@shared/constants';
import {UnifiedDeepLinkData} from 'react-native-appsflyer';
import {AppRoute} from './AppRouteManager';
import Config from 'react-native-config';
import AppManager from '@shared/managers/AppManager';

export class AppsflyerDeeplinkManager {
    static shared = new AppsflyerDeeplinkManager();

    private constructor() {}

    getIBomOneLinkTemplateId = (): string => {
        switch (Config.ENV) {
            case 'dev':
                return 'yMRF';
            case 'uat':
                return 'yMRF';
            case 'production':
                return 'Ydm1';
        }
    };

    handleDeeplink = (deeplink: UnifiedDeepLinkData): AppRoute | undefined => {
        if (deeplink.deepLinkStatus !== 'FOUND' || !deeplink.data) {
            return undefined;
        }
        const data = deeplink.data;
        const routeName = data.deep_link_value as PossibleDeepLinkRoutes;
        const paramJson = data.deep_link_sub1;
        const params = paramJson ? JSON.parse(paramJson) : undefined;
        const extras = data.deep_link_sub2
            ? JSON.parse(data.deep_link_sub2)
            : undefined;
        const needToReauthorize = extras?._u && extras?._p;
        if (needToReauthorize) {
            AppManager.reauthorizeUser(extras!._u, extras!._p);
        }

        return new AppRoute(routeName, params, extras);
    };
}
