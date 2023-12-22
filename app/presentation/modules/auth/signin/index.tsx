import { AuthRepository } from '@data/repository/auth';
import { UserRepository } from '@data/repository/user';
import { LoginEmailUseCase } from '@domain/auth/LoginEmailUseCase';
import LoginRequestModel from '@models/auth/request/LoginRequestModel';
import { APIError } from '@models/error/APIError';
import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getProfileActionTypes } from '@redux/actions/user';
import DropDownHolder from '@shared/helper/DropdownHolder';
import LoadingManager from '@shared/helper/LoadingManager';
import GeneratedImages from 'app/assets/GeneratedImages';
import { Input, TextButton, TextPrimary } from 'app/presentation/components';
import { Box } from 'app/presentation/components/globals/view/Box';
import { MainUserNavigator } from 'app/presentation/navigation/helper/shortcut';
import { theme } from 'app/presentation/theme';
import { Dimensions } from 'app/presentation/theme/Dimensions';
import { Formik, FormikProps } from 'formik';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Image, Platform, StyleSheet, TextInput, TouchableOpacity, View, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { OneSignal } from 'react-native-onesignal';
import { IUserRepository } from '@domain/user';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'SignIn'>;
    route: RouteProp<AppStackParamList, 'SignIn'>;
}

interface ISignInFormData {
    email: string;
    password: string;
}

const SignInAndSignUpScreen = React.memo((props: IProps) => {
    const { navigation } = props;
    const emailInput = useRef<TextInput | null>();
    const passwordInput = useRef<TextInput | null>();
    const userRepository = useRef<IUserRepository>(new UserRepository());
    const [initialEmail, setInitialEmail] = useState('');
    const [initialPass, setInitialPass] = useState('');
    const [secureText, setSecureText] = useState(true);
    const { t, } = useTranslation();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            email: Yup.string()
                .required(t('required')!)
                .email(t('invalidEmail')!),
            password: Yup.string()
                .required(t('required')!)
                .min(8, t('passwordTooShort')!)
        });
    }, [t]);

    useEffect(() => {
        DeviceEventEmitter.emit('credentialsReadyForUnauth');
        OneSignal.logout();

        userRepository.current.getUserCreds().then(userCreds => {
            if (userCreds && userCreds.length >= 2) {
                const [username, password] = userCreds;
                setInitialEmail(username);
                setInitialPass(password);
            }
        }).catch(() => { });
    }, []);

    const toHome = useCallback(() => {
        navigation.dispatch(MainUserNavigator);
    }, [navigation]);

    const toSignup = useCallback(() => {
        navigation.navigate('SignUpEmail');
    }, [navigation]);

    const onSubmit = useCallback(async (values: ISignInFormData) => {
        try {
            LoadingManager.setLoading(true);
            const userAgent = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
            const deviceId = await DeviceInfo.getUniqueId();
            const usecase = new LoginEmailUseCase({
                authRepository: new AuthRepository(),
                userRepository: new UserRepository(),
                body: new LoginRequestModel(values.email, values.password, userAgent, deviceId),
            });
            const user = await usecase.execute();
            dispatch(getProfileActionTypes.successAction(user));

            toHome();
        } catch (error) {
            const _error = error as APIError;
            DropDownHolder.showErrorAlert(_error.message);
        } finally {
            LoadingManager.setLoading(false);
        }
    }, [dispatch, toHome]);

    return <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + theme.spacing.small,
        }]}
        showsVerticalScrollIndicator={false}
    >
        <StatusBar barStyle={'dark-content'} />
        <Formik<ISignInFormData>
            validateOnBlur={false}
            validateOnChange
            enableReinitialize
            initialValues={{ email: initialEmail, password: initialPass }}
            validationSchema={validationSchema}
            onSubmit={(values) => onSubmit(values)}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldTouched, isValid }: FormikProps<ISignInFormData>) => {
                return <View style={styles.formContainer}>
                    <View>
                        <Image
                            style={styles.logo}
                            resizeMode="contain"
                            source={GeneratedImages.logo_ibom}
                        />
                        <Input
                            getRef={ref => emailInput.current = ref}
                            placeholder={t('email') ?? ''}
                            leftIcon={<FontAwesomeIcon
                                name="envelope-o"
                                size={theme.fontSize.fontSizeLarge}
                                color={theme.color.textColor}
                            />}
                            value={values.email}
                            errorMessage={touched.email ? errors.email : undefined}
                            keyboardType={'email-address'}
                            textContentType={'emailAddress'}
                            returnKeyType={'next'}
                            autoCapitalize="none"
                            onSubmitEditing={() => passwordInput.current?.focus()}
                            onFocus={() => setFieldTouched('email', true)}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                        />
                        <Input
                            getRef={ref => passwordInput.current = ref}
                            placeholder={t('password') ?? ''}
                            leftIcon={<FontAwesome5Icon
                                name="key"
                                size={theme.fontSize.fontSizeLarge}
                                color={theme.color.textColor}
                            />}
                            secureTextEntry={secureText}
                            textContentType={'password'}
                            returnKeyType={'done'}
                            autoCapitalize="none"
                            value={values.password}
                            errorMessage={touched.password ? errors.password : undefined}
                            onSubmitEditing={() => handleSubmit()}
                            onFocus={() => setFieldTouched('password', true)}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            rightIcon={<TouchableOpacity
                                onPress={() => {
                                    setSecureText(prevState => !prevState);
                                }}
                            >
                                <FontAwesome5Icon
                                    name={secureText ? 'eye-slash' : 'eye'}
                                    size={theme.fontSize.fontSizeLarge}
                                    color={theme.color.textColor}
                                />
                            </TouchableOpacity>}
                        />
                        <TextButton
                            title={t('login') ?? ''}
                            disabled={!isValid}
                            onPress={() => handleSubmit()}
                        />
                        <Box
                            direction="row"
                            justifyContent="center"
                            marginTop={theme.spacing.medium}
                        >
                            <TextPrimary style={{
                                fontWeight: '400',
                            }} variant="body2">{t('dontHaveAccountYet')}</TextPrimary>
                            <TouchableOpacity
                                onPress={toSignup}
                            >
                                <TextPrimary
                                    variant="body2"
                                    color={theme.color.colorPrimaryVariant}
                                    style={{
                                        fontWeight: '500',
                                    }}
                                > {t('signup')}</TextPrimary>
                            </TouchableOpacity>
                        </Box>
                    </View>
                    <Image
                        style={{
                            alignSelf: 'center',
                            width: Dimensions.moderateScale(250),
                            height: Dimensions.moderateScale(250) / 1.4,
                        }}
                        resizeMode={'contain'}
                        source={GeneratedImages.img_chatgpt}
                    />
                </View>;
            }}
        </Formik>
    </KeyboardAwareScrollView>;
});

export default SignInAndSignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorPrimary,
    },
    contentContainer: {
        paddingHorizontal: theme.spacing.extraLarge,
        minHeight: Dimensions.screenHeight(),
    },
    flag: {
        width: 30,
        height: 30,
        marginRight: theme.spacing.medium,
    },
    logo: {
        width: Dimensions.moderateScale(200),
        height: Dimensions.moderateScale(100),
        alignSelf: 'center',
        marginTop: Dimensions.verticalScale(45),
        marginBottom: Dimensions.verticalScale(45),
    },
    inputRightIcon: {
        width: Dimensions.moderateScale(20),
        height: Dimensions.moderateScale(20),
    },
    formContainer: {
        flex: 1,
        justifyContent: 'space-between',
    }
});
