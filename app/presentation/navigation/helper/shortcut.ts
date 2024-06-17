import { CommonActions } from '@react-navigation/native';

// export const AuthNavigator = StackActions.replace('SignIn');

// export const MainUserNavigator = StackActions.replace('AppTab');

export const AuthNavigator = CommonActions.reset({
    index: 0,
    routes: [
        { name: 'SignIn' },
    ],
});

export const MainUserNavigator = CommonActions.reset({
    index: 0,
    routes: [
        { name: 'AppTab' },
    ],
});

export const RestartNavigator = CommonActions.reset({
    index: 0,
    routes: [
        { name: 'SplashScreen' },
    ],
});