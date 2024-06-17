import {AllRouteParamList} from '@navigation/RouteParams';
import {
    PossibleDeepLinkRoutes,
    RouteAuthenticationRequires,
    DeepLinkRoutes,
} from '@shared/constants';
import NavigationService from '@shared/helper/NavigationService';
import AppManager from '@shared/managers/AppManager';

export class AppRoute {
    route: PossibleDeepLinkRoutes;
    params?: AllRouteParamList[keyof AllRouteParamList];
    extras?: Record<string, any>;
    routeNeedAuthentication: boolean;

    constructor(
        route: PossibleDeepLinkRoutes,
        params?: AllRouteParamList[keyof AllRouteParamList],
        extras?: Record<string, any>,
    ) {
        this.route = route;
        this.params = params;
        this.extras = extras;
        this.routeNeedAuthentication =
            RouteAuthenticationRequires[DeepLinkRoutes[route]];
    }
}

export class AppRouteManager {
    static shared = new AppRouteManager();

    pendingRoute?: AppRoute;

    private constructor() {}

    executeRoute = (route: AppRoute) => {
        const routeName = DeepLinkRoutes[route.route];
        if (routeName) {
            NavigationService.push(routeName, route.params);
        }
    };

    saveRoute = (route: AppRoute) => {
        this.pendingRoute = route;
    };

    handleRoute = (route: AppRoute) => {
        const extras = route.extras;
        // Request reauthorize
        if (extras?._u && extras?._p) {
            route.extras = undefined;
            this.saveRoute(route);
            return;
        }

        let canExecuteRoute = false;
        if (route.routeNeedAuthentication) {
            canExecuteRoute = AppManager.appState.credentialsReadyForAuth;
        } else if (AppManager.appState.credentialsReadyForUnauth) {
            canExecuteRoute = true;
        }
        if (canExecuteRoute) {
            this.executeRoute(route);
            this.pendingRoute = undefined;
        } else {
            this.saveRoute(route);
        }
    };

    executePendingRoute = () => {
        console.log('pendingRoute: ', this.pendingRoute);
        if (this.pendingRoute) {
            this.handleRoute(this.pendingRoute);
        }
    };
}
