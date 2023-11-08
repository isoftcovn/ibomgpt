import { ParamListBase, RouteProp } from '@react-navigation/native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IProps {
    focused: boolean;
    size: number;
    color: string;
    route: RouteProp<ParamListBase, string>;
}

export const TabbarIcon = React.memo((props: IProps) => {
    const { color, focused, size, route } = props;
    let iconName = '';

    if (route.name === 'HomeTab') {
        iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
    } else {
        iconName = focused ? 'person' : 'person-outline';
    }

    // You can return any component that you like here!
    return <Ionicons name={iconName} size={size} color={color} />;
});
