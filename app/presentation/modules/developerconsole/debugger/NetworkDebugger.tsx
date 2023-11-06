import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import NetworkLogger from 'react-native-network-logger';

interface IProps {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<any, any>;
}

const NetworkDebugger = (props: IProps) => <NetworkLogger />;

export default NetworkDebugger;
