import { Box } from '@components/globals/view/Box';
import { TextButton, TextPrimary } from '@components/index';
import { UserRepository } from '@data/repository/user';
import LogoutUseCase from '@domain/user/LogoutUseCase';
import UserModel from '@models/user/response/UserModel';
import { AuthNavigator } from '@navigation/helper/shortcut';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { selectProfile } from '@redux/selectors/user';
import { Dimensions } from '@theme/Dimensions';
import { theme } from '@theme/index';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinkingHelper from '@shared/helper/LinkingHelper';

interface IProps {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<any, any>;
}

const AccountScreen = (props: IProps) => {
    const { navigation } = props;
    const { t } = useTranslation();
    const profile: UserModel | undefined = useSelector(selectProfile).data;

    useEffect(() => {
        navigation.setOptions({
            title: t('myAccount') ?? '',
        });
    }, [t, navigation]);

    const logout = useCallback(async () => {
        Alert.alert(t('logout'), t('logoutConfirmation') ?? '', [
            {
                text: t('cancel') ?? '',
                style: 'cancel'
            },
            {
                text: t('logout') ?? '',
                style: 'destructive',
                onPress: () => {
                    const usecase = new LogoutUseCase(new UserRepository());
                    usecase.execute().catch(error => {
                        console.warn('Logout error: ', error);
                    });
                    navigation.dispatch(AuthNavigator);
                }
            }
        ], {
            cancelable: true,
        });
    }, [navigation, t]);

    return <View style={styles.container}>
        <View style={styles.itemContainer}>
            <FastImage
                style={styles.avatar}
                resizeMode={'cover'}
                source={{
                    uri: profile?.avatar ?? '',
                }}
            />
            <Box marginLeft={theme.spacing.large} />
            <View>
                <TextPrimary variant="body1">{profile?.fullname ?? ''}</TextPrimary>
                {profile?.email ? <TextPrimary style={{
                    ...theme.textVariants.body2,
                    color: theme.color.labelColor,
                }}>{profile?.email ?? ''}</TextPrimary> : null}
            </View>
        </View>
        <Box marginTop={theme.spacing.small} />
        <TouchableOpacity
            style={styles.itemContainer}
            activeOpacity={0.8}
            onPress={() => {
                LinkingHelper.openUrl('https://ibom.vn/hoi-dap-ibom.html');
            }}
        >
            <Ionicons
                name={'help-buoy-outline'}
                size={Dimensions.moderateScale(30)}
                color={theme.color.colorPrimary}
            />
            <Box marginLeft={theme.spacing.medium} />
            <TextPrimary variant="body1">{t('helpCenter')}</TextPrimary>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.itemContainer}
            activeOpacity={0.8}
            onPress={() => {
                LinkingHelper.openUrl('https://ibom.vn/');
            }}
        >
            <Ionicons
                name={'information-circle-outline'}
                size={Dimensions.moderateScale(30)}
                color={theme.color.colorPrimary}
            />
            <Box marginLeft={theme.spacing.medium} />
            <TextPrimary variant="body1">{t('aboutUs')}</TextPrimary>
        </TouchableOpacity>
        <Box marginTop={theme.spacing.small} />
        <TouchableOpacity
            style={styles.itemContainer}
            activeOpacity={0.8}
            onPress={logout}
        >
            <TextPrimary style={{
                textAlign: 'center',
                flex: 1,
                color: theme.color.danger,
                fontWeight: '400'
            }} variant="body1">{t('logout')}</TextPrimary>
        </TouchableOpacity>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorVariant,
    },
    itemContainer: {
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.medium,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.color.backgroundColorPrimary,
    },
    avatar: {
        width: Dimensions.moderateScale(45),
        height: Dimensions.moderateScale(45),
        borderRadius: Dimensions.moderateScale(45) / 2,
    }
});

export default AccountScreen;
