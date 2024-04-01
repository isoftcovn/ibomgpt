import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '@theme/index';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'CommonFilter'>
    route: RouteProp<AppStackParamList, 'CommonFilter'>;
}

export const CommonFilter = (props: IProps) => {
    const {navigation, route} = props;
    const {t} = useTranslation();

    useEffect(() => {
        navigation.setOptions({
            title: route.params.title ?? t('filter'),
        });
    }, [navigation, route.params, t]);

    return <View style={styles.container}>

    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorPrimary,
    }
});
