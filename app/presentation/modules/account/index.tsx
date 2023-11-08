import { TextButton } from '@components/index';
import { UserRepository } from '@data/repository/user';
import LogoutUseCase from '@domain/user/LogoutUseCase';
import { AuthNavigator } from '@navigation/helper/shortcut';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '@theme/index';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

interface IProps {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<any, any>;
}

const AccountScreen = (props: IProps) => {
    const { navigation } = props;
    const logout = useCallback(async () => {
        const usecase = new LogoutUseCase(new UserRepository());
        usecase.execute().catch(error => {
            console.warn('Logout error: ', error);
        });
        navigation.dispatch(AuthNavigator);
    }, [navigation]);

    return <View style={styles.container}>
        <TextButton
            title={'Logout'}
            onPress={logout}
        />
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorPrimary,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default AccountScreen;
