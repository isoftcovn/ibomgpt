import { DeepLinkKeys, DeepLinkRoutes, PossibleDeepLinkRoutes } from 'app/shared/constants';
import NavigationService from 'app/shared/helper/NavigationService';
import AppManager from 'app/shared/managers/AppManager';
import qs from 'query-string';
import Config from 'react-native-config';

class DeeplinkHandler {
    shouldIgnoreDeeplink = (url: string): boolean => {
        if (url.includes('auth0')) {return true;}
        if (url.startsWith(Config.DYNAMIC_LINK_URL)) {return true;}
        return false;
    };

    handleDeeplinkUrl = (url: string): boolean => {
        const extracted = qs.parseUrl(url);
        const _url = extracted.url;
        if (this.shouldIgnoreDeeplink(_url)) {
            console.info('Ignore deeplink: ', extracted);
            return true;
        }
        console.info('Deeplink: ', extracted);
        const deeplinkScheme = `${Config.DEEPLINK_SCHEME}://`;
        const isDeeplink = _url.startsWith(deeplinkScheme);
        const paramsString: any = _url.replace(`${Config.DEEPLINK_SCHEME}://`, '').replace('https://', '').split('/') || [];
        if (!isDeeplink) {
            paramsString.shift();
        }
        if (paramsString.length === 0) {
            return true;
        }
        const key: PossibleDeepLinkRoutes = paramsString[0];
        const paramsValue = paramsString[1];
        const routeName = DeepLinkRoutes?.[key];
        const objectParams: any = {};
        if (paramsValue) {
            objectParams[DeepLinkKeys?.[key]] = paramsValue;
        }

        let deeplinkConsumed = false;
        if (routeName === DeepLinkRoutes['my-accounnt']) {
            if (AppManager.appState.credentialsReadyForAuth) {
                const routeName = DeepLinkRoutes?.[key];
                NavigationService.push(routeName, objectParams);
                deeplinkConsumed = true;
            }
        } else {
            if (AppManager.appState.credentialsReadyForAuth) {
                NavigationService.push(routeName, objectParams);
                deeplinkConsumed = true;
            }
        }

        return deeplinkConsumed;
    };
}

export default new DeeplinkHandler();
