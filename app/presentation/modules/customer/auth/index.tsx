import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import GeneratedImages from 'app/assets/GeneratedImages';
import { Input, TextButton, TextPrimary } from 'app/presentation/components';
import { Box } from 'app/presentation/components/globals/view/Box';
import { MainUserNavigator } from 'app/presentation/navigation/helper/shortcut';
import { theme } from 'app/presentation/theme';
import { Dimensions } from 'app/presentation/theme/Dimensions';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, ScrollView, StyleSheet } from 'react-native';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'SignIn'>;
    route: RouteProp<AppStackParamList, 'SignIn'>;
}

const SignInAndSignUpScreen = React.memo((props: IProps) => {
    const {navigation} = props;
    const {t, i18n} = useTranslation();

    useEffect(() => {
        DeviceEventEmitter.emit('credentialsReadyForUnauth');
    }, []);

    const toHome = useCallback(() => {
        navigation.dispatch(MainUserNavigator);
    }, [navigation]);

    return <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
    >
        <TextPrimary variant={'header'}>
            {t('keyWithCount', {
                count: 1,
            })}
        </TextPrimary>
        <TextPrimary variant={'subHeader'}>
            {t('keyWithCount', {
                count: 2,
            })}
        </TextPrimary>
        <TextPrimary variant={'title1'}>
            Title 1
        </TextPrimary>
        <TextPrimary variant={'title2'}>
            Title 2
        </TextPrimary>
        <TextPrimary variant={'title3'}>
            Title 3
        </TextPrimary>
        <TextPrimary variant={'subtitle1'}>
            Subtitle 1
        </TextPrimary>
        <TextPrimary variant={'subtitle2'}>
            Subtitle 2
        </TextPrimary>
        <TextPrimary variant={'body1'}>
            Body 1
        </TextPrimary>
        <TextPrimary variant={'body2'}>
            Body 2
        </TextPrimary>
        <TextPrimary variant={'body3'}>
            Body 3
        </TextPrimary>
        <TextPrimary variant={'label1'}>
            Label 1
        </TextPrimary>
        <TextPrimary variant={'label2'}>
            Label 2
        </TextPrimary>
        <TextPrimary variant={'button1'}>
            Button 1
        </TextPrimary>
        <TextPrimary variant={'button2'}>
            Button 2
        </TextPrimary>
        <Box marginTop={'medium'} />
        <TextPrimary variant="body1">
            {`Current language: ${i18n.language}`}
        </TextPrimary>
        <Box marginTop={'medium'} />
        <TextButton
            title={'Switch language'}
            onPress={() => {
                i18n.changeLanguage(i18n.language === 'en' ? 'vi_VN' : 'en');
            }}
        />
        <Box marginTop={'medium'} />
        <TextButton
            title={'To Home'}
            buttonType={'outline'}
            onPress={toHome}
        />
        <Box marginTop={'medium'} />
        <TextButton
            title={'To Home'}
            buttonType={'transparent'}
            onPress={toHome}
        />
        <Box marginTop={'medium'} />
        <Input
            placeholder={'Placeholder'}
            iconSource={GeneratedImages.ic_account}
        />
        <Box marginTop={'medium'} />
        <Input
            placeholder={'Placeholder'}
            value={'Text value'}
            iconSource={GeneratedImages.ic_account}
        />
        <Box marginTop={'medium'} />
        <Input
            placeholder={'Placeholder'}
            errorMessage={'error'}
            iconSource={GeneratedImages.ic_account}
        />
    </ScrollView>;
});

export default SignInAndSignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: Dimensions.getStatusBarHeight(true),
        backgroundColor: theme.color.backgroundColorPrimary,
        paddingHorizontal: theme.spacing.extraLarge,
    },
    flag: {
        width: 30,
        height: 30,
        marginRight: theme.spacing.medium,
    },
});
