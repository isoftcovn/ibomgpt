import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyFlatList, TextPrimary } from 'app/presentation/components';
import { theme } from 'app/presentation/theme';
import { NavigationRoutes } from 'app/shared/constants';
import React, { useEffect, useState } from 'react';
import Config from 'react-native-config';
import styled from 'styled-components';

interface IProps {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<any, any>;
}

interface IDeveloperItem {
    key: string;
    title: string;
}

const DeveloperConsole = React.memo((props: IProps) => {
    const {navigation} = props;
    const [items, setItems] = useState<IDeveloperItem[]>([]);

    useEffect(() => {
        const items: IDeveloperItem[] = [];
        if (Config.ENABLE_NETWORK_DEBUGGER == 'true') {
            items.push({ key: NavigationRoutes.NetworkDebugger, title: 'Network Debugger' });
        }
        setItems(items);
    }, []);

    const onItemPress = (item: IDeveloperItem) => {
        navigation.navigate(item.key);
    };

    const renderItem = ({ item, index }: { item: IDeveloperItem, index: number }) => {
        return <ItemContainer onPress={() => onItemPress(item)}>
            <TextPrimary>{item.title}</TextPrimary>
        </ItemContainer>;
    };

    return <MyFlatList
        data={items}
        keyExtractor={item => item.key}
        renderItem={renderItem}
    />;
});

const ItemContainer = styled.TouchableOpacity`
    paddingHorizontal: ${theme.spacing.large}px;
    paddingVertical: ${theme.spacing.medium}px;
    borderWidth: 1px;
    borderRadius: 5px;
`;

export default DeveloperConsole;
