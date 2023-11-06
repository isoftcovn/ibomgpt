import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '@modules/auth';
import LanguageScreen from '@modules/languages';
import { StartScreen } from '@modules/start';
import React from 'react';
import DeveloperConsole from '@modules/developerconsole';
import NetworkDebugger from '@modules/developerconsole/debugger/NetworkDebugger';
import { AppStackParamList } from './RouteParams';
import AppTab from './routes/AppTab';



const Stack = createStackNavigator<AppStackParamList>();

interface IProps {

}

// Only use one Stack for further auto testing. React Navigation deeply nested view on ios
export const RootStack = (props: IProps) => {
    return <Stack.Navigator
        initialRouteName={'SplashScreen'}
        screenOptions={{
            presentation: 'card',
            headerMode: 'screen',
            animationTypeForReplace: 'pop',
        }}
    >
        <Stack.Screen name={'SplashScreen'} component={StartScreen} options={{
            headerShown: false,
        }} />
        <Stack.Screen name="AppTab" component={AppTab} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Languages" component={LanguageScreen} />
        <Stack.Group
            screenOptions={{
                headerTintColor: '#000000',
            }}
        >
            <Stack.Screen name="DeveloperConsole" component={DeveloperConsole} />
            <Stack.Screen name="NetworkDebugger" component={NetworkDebugger} />
        </Stack.Group>
    </Stack.Navigator>;
};

export const createAppRoot = () => {
    return () => <RootStack />;
};
