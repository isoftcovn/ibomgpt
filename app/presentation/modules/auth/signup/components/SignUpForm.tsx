import { Box } from '@components/globals/view/Box';
import { Input, TextButton, TextPrimary } from '@components/index';
import { AuthRepository } from '@data/repository/auth';
import { UserRepository } from '@data/repository/user';
import { SignupEmailUseCase } from '@domain/auth/SignupEmailUseCase';
import { APIError } from '@models/error/APIError';
import { AppStackParamList } from '@navigation/RouteParams';
import { StackNavigationProp } from '@react-navigation/stack';
import DropDownHolder from '@shared/helper/DropdownHolder';
import LoadingManager from '@shared/helper/LoadingManager';
import { theme } from '@theme/index';
import { Formik, FormikProps } from 'formik';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import * as Yup from 'yup';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'SignUpEmail'>;
}

export interface ISignInFormData {
    email: string;
    name: string
    password: string;
    confirmPassword: string;
}

export const SignUpEmailForm = React.memo((props: IProps) => {
    const { navigation } = props;
    const [secure, setSecure] = useState(true);
    const [confirmSecure, setConfirmSecure] = useState(true);
    const emailInput = useRef<TextInput | null>();
    const nameInput = useRef<TextInput | null>();
    const passwordInput = useRef<TextInput | null>();
    const cfPasswordInput = useRef<TextInput | null>();
    const { t } = useTranslation();

    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            email: Yup.string()
                .required(t('required') ?? '')
                .email(t('invalidEmail') ?? ''),
            name: Yup.string().required(),
            password: Yup.string()
                .required(t('required') ?? '')
                .min(8, t('passwordTooShort')!),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], t('passwordMustMatch') ?? '')
        });
    }, [t]);

    const toSignin = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onSubmit = useCallback(async (values: ISignInFormData) => {
        try {
            const parts = values.name.split(' ');
            const firstName = parts[0];
            const lastName = parts.slice(1).join(' ');
            const usecase = new SignupEmailUseCase({
                authRepository: new AuthRepository(),
                userRepository: new UserRepository(),
            });
            LoadingManager.setLoading(true);
            await usecase.execute();
            navigation.goBack();
        } catch (error) {
            const _error = error as APIError;
            DropDownHolder.showErrorAlert(_error.message);
        } finally {
            LoadingManager.setLoading(false);
        }
    }, [navigation]);

    return <Formik<ISignInFormData>
        validateOnBlur={false}
        validateOnChange
        enableReinitialize
        validateOnMount
        initialValues={{
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values)}
    >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldTouched, isValid }: FormikProps<ISignInFormData>) => {
            return <View style={styles.container}>
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
                    onSubmitEditing={() => nameInput.current?.focus()}
                    onFocus={() => setFieldTouched('email', true)}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                />
                <Input
                    getRef={ref => nameInput.current = ref}
                    placeholder={t('name') ?? ''}
                    leftIcon={<FontAwesome5Icon
                        name="user-alt"
                        size={theme.fontSize.fontSizeLarge}
                        color={theme.color.textColor}
                    />}
                    value={values.name}
                    errorMessage={touched.name ? errors.name : undefined}
                    returnKeyType={'next'}
                    onSubmitEditing={() => passwordInput.current?.focus()}
                    onFocus={() => setFieldTouched('name', true)}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                />
                <Input
                    getRef={ref => passwordInput.current = ref}
                    placeholder={t('password') ?? ''}
                    leftIcon={<FontAwesome5Icon
                        name="key"
                        size={theme.fontSize.fontSizeLarge}
                        color={theme.color.textColor}
                    />}
                    rightIcon={<TouchableOpacity
                        onPress={() => setSecure(prevState => !prevState)}
                    >
                        <FontAwesome5Icon
                            name={secure ? 'eye-slash' : 'eye'}
                            size={theme.fontSize.fontSizeLarge}
                            color={theme.color.textColor}
                        />
                    </TouchableOpacity>}
                    value={values.password}
                    secureTextEntry={secure}
                    textContentType={'password'}
                    returnKeyType={'next'}
                    errorMessage={touched.password ? errors.password : undefined}
                    onSubmitEditing={() => cfPasswordInput.current?.focus()}
                    onFocus={() => setFieldTouched('password', true)}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                />
                <Input
                    getRef={ref => cfPasswordInput.current = ref}
                    placeholder={t('confirmPassword') ?? ''}
                    leftIcon={<FontAwesome5Icon
                        name="key"
                        size={theme.fontSize.fontSizeLarge}
                        color={theme.color.textColor}
                    />}
                    rightIcon={<TouchableOpacity
                        onPress={() => setConfirmSecure(prevState => !prevState)}
                    >
                        <FontAwesome5Icon
                            name={confirmSecure ? 'eye-slash' : 'eye'}
                            size={theme.fontSize.fontSizeLarge}
                            color={theme.color.textColor}
                        />
                    </TouchableOpacity>}
                    secureTextEntry={confirmSecure}
                    textContentType={'password'}
                    returnKeyType={'done'}
                    value={values.confirmPassword}
                    errorMessage={touched.confirmPassword ? errors.confirmPassword : undefined}
                    onSubmitEditing={() => handleSubmit()}
                    onFocus={() => setFieldTouched('confirmPassword', true)}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                />
                <Box marginTop={theme.spacing.large} />
                <TextButton
                    title={t('signup') ?? ''}
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
                    }} variant="body2">{t('alreadyHaveAccount')}</TextPrimary>
                    <TouchableOpacity
                        onPress={toSignin}
                    >
                        <TextPrimary
                            variant="body2"
                            color={theme.color.colorPrimaryVariant}
                            style={{
                                fontWeight: '500',
                            }}
                        > {t('login')}</TextPrimary>
                    </TouchableOpacity>
                </Box>
            </View>;
        }}
    </Formik>;
});

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.extraLarge,
    }
});

