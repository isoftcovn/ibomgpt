import { PossibleDeepLinkRoutes } from '@shared/constants';
import { UnifiedDeepLinkData } from 'react-native-appsflyer';
import { AppRoute } from './AppRouteManager';
import Config from 'react-native-config';

export class AppsflyerDeeplinkManager {
    static shared = new AppsflyerDeeplinkManager();

    private constructor() { }

    getIBomOneLinkTemplateId = (): string => {
        switch (Config.ENV) {
            case 'dev':
                return '';
            case 'uat':
                return '';
            case 'production':
                return '';
        }
    };

    handleDeeplink = (deeplink: UnifiedDeepLinkData): AppRoute | undefined => {
        if (deeplink.deepLinkStatus !== 'FOUND' || !deeplink.data) { return undefined; }
        const data = deeplink.data;
        const routeName = data.deep_link_value as PossibleDeepLinkRoutes;
        const paramJson = data.deep_link_sub1;
        const userEmail = data.deep_link_sub2;
        const params = paramJson ? JSON.parse(paramJson) : undefined;

        return new AppRoute(routeName, params, userEmail);
    };
}
