import { UserRepository } from '@data/repository/user';
import { IUserRepository } from '@domain/user';
import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextPrimary } from 'app/presentation/components';
import { Box } from 'app/presentation/components/globals/view/Box';
import { InitAppStatus, useInitApp } from 'app/presentation/hooks/general/useInitApp';
import { AuthNavigator, MainUserNavigator } from 'app/presentation/navigation/helper/shortcut';
import { theme } from 'app/presentation/theme';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import styled from 'styled-components';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'SplashScreen'>;
    route: RouteProp<AppStackParamList, 'SplashScreen'>;
}

export const StartScreen = React.memo((props: IProps) => {
    const { navigation } = props;
    const userRepositoryRef = useRef<IUserRepository>(new UserRepository());
    const [tryAgainTimestamp, setTryAgainTimestamp] = useState<number>();
    const initAppStatus = useInitApp(userRepositoryRef.current, tryAgainTimestamp);

    const _openUserHomeScreen = useCallback(() => {
        navigation.dispatch(MainUserNavigator);
    }, [navigation]);

    const _openSignInScreen = useCallback(() => {
        navigation.dispatch(AuthNavigator);
    }, [navigation]);

    const _showVersionUpgradePopup = useCallback(() => {

    }, []);

    const _showTryAgainPopup = useCallback(() => {
        Alert.alert('Error!!!', 'Something went wrong.',
            [
                {
                    text: 'Try again',
                    onPress: () => {
                        setTryAgainTimestamp((new Date()).getTime());
                    }
                }
            ],
            {
                cancelable: false,
            }
        );
    }, []);

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    useEffect(() => {
        switch (initAppStatus) {
            case InitAppStatus.versionInvalid:
                _showVersionUpgradePopup();
                break;
            case InitAppStatus.unauthenicated:
                _openSignInScreen();
                break;
            case InitAppStatus.authenicated:
                _openUserHomeScreen();
                break;
            case InitAppStatus.error:
                _showTryAgainPopup();
                break;
        }
    }, [initAppStatus, _showVersionUpgradePopup, _openUserHomeScreen, _openSignInScreen, _showTryAgainPopup]);

    return (
        <Box style={styles.container} justifyContent={'center'} alignItems={'center'}>
            <Title>Hello Developers</Title>
        </Box>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorPrimary,
    },
});

const Title = styled(TextPrimary)`
    fontSize: 32px;
    color: #ffffff;
`;
