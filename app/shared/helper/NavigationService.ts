import {AllRouteParamList} from '@navigation/RouteParams';
import {
    NavigationContainerRef,
    StackActions,
    CommonActions,
} from '@react-navigation/native';

export default class NavigationService {
    static topLevelNavigator?: NavigationContainerRef<any>;

    static setTopLevelNavigator = (ref: NavigationContainerRef<any>) =>
        (NavigationService.topLevelNavigator = ref);

    static navigate = <RouteName extends keyof AllRouteParamList>(
        routeName: RouteName,
        params?: AllRouteParamList[RouteName],
    ) => {
        if (NavigationService.topLevelNavigator) {
            NavigationService.topLevelNavigator.dispatch(
                CommonActions.navigate({
                    name: routeName,
                    params,
                }),
            );
        }
    };

    static replace = <RouteName extends keyof AllRouteParamList>(
        routeName: RouteName,
        params?: AllRouteParamList[RouteName],
    ) => {
        if (NavigationService.topLevelNavigator) {
            NavigationService.topLevelNavigator.dispatch(
                StackActions.replace(routeName, params),
            );
        }
    };

    static push = <RouteName extends keyof AllRouteParamList>(
        routeName: RouteName,
        params?: AllRouteParamList[RouteName],
    ) => {
        if (NavigationService.topLevelNavigator) {
            NavigationService.topLevelNavigator.dispatch(
                StackActions.push(routeName, params),
            );
        }
    };

    static pop = () => {
        if (NavigationService.topLevelNavigator) {
            NavigationService.topLevelNavigator.dispatch(
                CommonActions.goBack(),
            );
        }
    };

    static popToTop = () => {
        if (NavigationService.topLevelNavigator) {
            NavigationService.topLevelNavigator.dispatch(
                StackActions.popToTop(),
            );
        }
    };

    static popRoute = <RouteName extends keyof AllRouteParamList>(
        routeName: RouteName,
    ) => {
        if (NavigationService.topLevelNavigator) {
            const state = NavigationService.topLevelNavigator?.getState();
            const routes = state?.routes ?? [];
            const index = routes.findIndex(item => item.name === routeName);
            if (index !== -1) {
                NavigationService.topLevelNavigator.dispatch(
                    StackActions.pop(routes.length - index),
                );
            }
        }
    };
}
