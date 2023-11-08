import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '@theme/index';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SignUpEmailForm } from './components/SignUpForm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'SignUpEmail'>;
    route: RouteProp<AppStackParamList, 'SignUpEmail'>;
}

export const SignUpEmailScreen = React.memo((props: IProps) => {
    const { navigation } = props;
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    useEffect(() => {
        navigation.setOptions({
            title: t('signup') ?? ''
        });
    }, [navigation, t]);

    return <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{
            paddingTop: theme.spacing.giant,
            paddingBottom: insets.bottom + theme.spacing.small,
        }}
        showsVerticalScrollIndicator={false}
    >
        <StatusBar barStyle={'light-content'} />
        <SignUpEmailForm
            navigation={navigation}
        />
    </KeyboardAwareScrollView>;
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorPrimary,
    },

});
