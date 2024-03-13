import { AllRouteParamList } from '@navigation/RouteParams';
import { PossibleDeepLinkRoutes, RouteAuthenticationRequires, DeepLinkRoutes } from '@shared/constants';
import NavigationService from '@shared/helper/NavigationService';
import AppManager from '@shared/managers/AppManager';

export class AppRoute {
    route: PossibleDeepLinkRoutes;
    params?: AllRouteParamList[keyof AllRouteParamList];
    userEmail?: string;
    routeNeedAuthentication: boolean;

    constructor(route: PossibleDeepLinkRoutes, params?: AllRouteParamList[keyof AllRouteParamList], userEmail?: string) {
        this.route = route;
        this.params = params;
        this.userEmail = userEmail;
        this.routeNeedAuthentication = RouteAuthenticationRequires[DeepLinkRoutes[route]];
    }
}

export class AppRouteManager {
    static shared = new AppRouteManager();

    pendingRoute?: AppRoute;

    private constructor() { }

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
        if (this.pendingRoute) {
            this.handleRoute(this.pendingRoute);
        }
    };
}
