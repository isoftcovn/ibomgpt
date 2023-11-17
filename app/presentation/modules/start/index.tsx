import GeneratedImages from '@assets/GeneratedImages';
import { TextPrimary } from '@components/index';
import { UserRepository } from '@data/repository/user';
import { IUserRepository } from '@domain/user';
import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Dimensions } from '@theme/Dimensions';
import { InitAppStatus, useInitApp } from 'app/presentation/hooks/general/useInitApp';
import { AuthNavigator, MainUserNavigator } from 'app/presentation/navigation/helper/shortcut';
import { theme } from 'app/presentation/theme';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'SplashScreen'>;
    route: RouteProp<AppStackParamList, 'SplashScreen'>;
}

export const StartScreen = React.memo((props: IProps) => {
    const { navigation } = props;
    const userRepositoryRef = useRef<IUserRepository>(new UserRepository());
    const [tryAgainTimestamp, setTryAgainTimestamp] = useState<number>();
    const initAppStatus = useInitApp(userRepositoryRef.current, tryAgainTimestamp);
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

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
        <View style={styles.container}>
            <Image
                style={styles.logo}
                resizeMode={'contain'}
                source={GeneratedImages.logo_ibom}
            />
            {initAppStatus === InitAppStatus.loading && <View style={[styles.loadingContainer, {
                bottom: insets.bottom + theme.spacing.medium,
            }]}>
                <ActivityIndicator
                    animating
                    color={theme.color.textColor}
                />
                <TextPrimary style={{
                    ...theme.textVariants.body2,
                    marginLeft: theme.spacing.small,
                }}>{t('loading')}</TextPrimary>
            </View>}
        </View>
    );
});

const logoRatio = 320 / 169;
const logoWidth = Dimensions.screenWidth() / 1.75;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorPrimary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: logoWidth,
        height: logoWidth / logoRatio,
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    }
});
