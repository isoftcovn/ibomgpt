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
import { DeviceEventEmitter, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

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
    }, []);

    const toHome = useCallback(() => {
        navigation.dispatch(MainUserNavigator);
    }, [navigation]);

    const onSubmit = useCallback(async (values: ISignInFormData) => {
        try {
            LoadingManager.setLoading(true);
            const userAgent = await DeviceInfo.getUserAgent();
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
    >
        <Formik<ISignInFormData>
            validateOnBlur={false}
            validateOnChange
            enableReinitialize
            initialValues={{ email: '', password: '' }}
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
                            iconSource={GeneratedImages.ic_account}
                            errorMessage={touched.email ? errors.email : undefined}
                            keyboardType={'email-address'}
                            textContentType={'emailAddress'}
                            returnKeyType={'next'}
                            onSubmitEditing={() => passwordInput.current?.focus()}
                            onFocus={() => setFieldTouched('email', true)}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                        />
                        <Input
                            getRef={ref => passwordInput.current = ref}
                            placeholder={t('password') ?? ''}
                            iconSource={GeneratedImages.ic_lock_open}
                            secureTextEntry={secureText}
                            textContentType={'password'}
                            returnKeyType={'done'}
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
                                <Image
                                    style={styles.inputRightIcon}
                                    resizeMode={'contain'}
                                    source={secureText ? GeneratedImages.ic_eye_off : GeneratedImages.ic_eye}
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
                            <TouchableOpacity>
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
                    <Box style={{
                        alignSelf: 'center',
                        width: Dimensions.moderateScale(250),
                        height: Dimensions.moderateScale(150),
                        backgroundColor: theme.color.colorPrimary,
                    }} />
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
        width: Dimensions.moderateScale(228),
        height: Dimensions.moderateScale(120),
        alignSelf: 'center',
        marginTop: Dimensions.verticalScale(50),
        marginBottom: Dimensions.verticalScale(50),
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
