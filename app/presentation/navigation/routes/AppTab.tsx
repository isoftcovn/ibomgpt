import { TabbarIcon } from '@navigation/components/TabbarIcon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '@theme/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import HomeScreen from '@modules/home';
import { createDefaultStackNavigationOptions } from '../config/header';
import AccountScreen from '@modules/account';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface IProps {

}

const HomeStack = (props: IProps) => {
    const defaultOptions = createDefaultStackNavigationOptions();

    return <Stack.Navigator screenOptions={defaultOptions} initialRouteName={'HomeScreen'}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>;
};

const MyAccountStack = (props: IProps) => {
    const defaultOptions = createDefaultStackNavigationOptions();

    return <Stack.Navigator screenOptions={defaultOptions}>
        <Stack.Screen name="MyAccountScreen" component={AccountScreen} options={{ title: 'My Account' }} />
    </Stack.Navigator>;
};

const AppTab = (props: IProps) => {
    const { t } = useTranslation();
    return <Tab.Navigator initialRouteName={'Home'}
        screenOptions={({ route }) => ({
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({ focused, color, size }) => {
                return <TabbarIcon
                    color={color}
                    focused={focused}
                    size={size}
                    route={route}
                />;
            },
            tabBarActiveTintColor: theme.color.colorPrimary,
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
        })}
    >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{
            title: t('message') ?? '',
        }} />
        <Tab.Screen name="MyAccountTab" component={MyAccountStack} options={{
            title: t('personal') ?? '',
        }} />
    </Tab.Navigator>;
};

export default AppTab;
