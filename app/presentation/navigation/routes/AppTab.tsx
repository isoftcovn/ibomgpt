import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../../modules/home';
import Home1 from '../../modules/home/Home1';
import Home2 from '../../modules/home/Home2';
import { createDefaultStackNavigationOptions } from '../config/header';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface IProps {

}

const HomeStack = (props: IProps) => {
    const defaultOptions = createDefaultStackNavigationOptions();

    return <Stack.Navigator screenOptions={defaultOptions} initialRouteName={'HomeScreen'}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'List' }} />
    </Stack.Navigator>;
};

const StatisticsStack = (props: IProps) => {
    const defaultOptions = createDefaultStackNavigationOptions();

    return <Stack.Navigator screenOptions={defaultOptions}>
        <Stack.Screen name="StatisticsScreen" component={Home1} options={{ title: 'Statistics' }} />
    </Stack.Navigator>;
};

const MyAccountStack = (props: IProps) => {
    const defaultOptions = createDefaultStackNavigationOptions();

    return <Stack.Navigator screenOptions={defaultOptions}>
        <Stack.Screen name="MyAccountScreen" component={Home2} options={{ title: 'My Account' }} />
    </Stack.Navigator>;
};

const AppTab = (props: IProps) => {
    return <Tab.Navigator initialRouteName={'Home'}
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName = '';

                if (route.name === 'HomeTab') {
                    iconName = 'home-outline';
                } else if (route.name === 'StatisticsTab') {
                    iconName = 'information-circle-outline';
                } else {
                    iconName = 'settings-outline';
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
        })}
    >
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="StatisticsTab" component={StatisticsStack} />
        <Tab.Screen name="MyAccountTab" component={MyAccountStack} />
    </Tab.Navigator>;
};

export default AppTab;
