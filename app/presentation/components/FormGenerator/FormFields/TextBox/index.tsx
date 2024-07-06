import {useField} from 'formik';
import React, {useCallback} from 'react';
import {Platform, StyleSheet, TextInput, View} from 'react-native';
import {FormFieldBaseProps, IFieldValues} from '../../model';
import {useTranslation} from 'react-i18next';
import TextPrimary from '@components/globals/text/TextPrimary';
import { theme } from '@theme/index';

interface IProps extends FormFieldBaseProps {}

export const FormFieldTextBox = React.memo((props: IProps) => {
    const {field} = props;
    const {label, is_required, max, min, fieldContainerStyle} = field;

    const {t} = useTranslation();

    const validate = useCallback(
        (value: IFieldValues | undefined) => {
            const text = `${value?.value ?? ''}`;
            if (is_required && text.length === 0) {
                return t('warn_empty');
            }
            if (min && !isNaN(parseInt(`${min}`, 10))) {
                const _min = parseInt(`${min}`, 10);
                if ((text.length ?? 0) < _min) {
                    return t('min_characters', {
                        min: _min,
                    });
                }
            }

            if (max && !isNaN(parseInt(`${max}`, 10))) {
                const _max = parseInt(`${max}`, 10);
                if ((text.length ?? 0) > _max) {
                    return t('max_characters', {
                        max: _max,
                    });
                }
            }

            return undefined;
        },
        [is_required, max, min, t],
    );

    const [formikField, meta, helpers] = useField<IFieldValues | undefined>({
        name: field.id,
        validate,
    });

    const onTextChanged = useCallback(
        (text: string) => {
            helpers.setValue({
                text,
                value: text,
            });
        },
        [helpers],
    );

    return (
        <View style={[styles.container, fieldContainerStyle]}>
            <TextPrimary style={styles.label}>
                {label}
                {is_required ? (
                    <TextPrimary style={[styles.label, {color: theme.color.danger}]}>
                        {' '}
                        {'*'}
                    </TextPrimary>
                ) : null}
            </TextPrimary>
            <TextInput
                style={styles.input}
                value={`${formikField.value?.value ?? ''}`}
                placeholderTextColor={theme.color.labelColor}
                onChangeText={onTextChanged}
                onFocus={() => {
                    if (!meta.touched) {
                        helpers.setTouched(true);
                    }
                }}
                onBlur={formikField.onBlur(field.id)}
                underlineColorAndroid={'transparent'}
            />
            <View style={styles.bottomLine} />
            {meta.error && meta.touched ? (
                <TextPrimary style={[styles.error]}>{meta.error}</TextPrimary>
            ) : null}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        marginVertical: 8,
    },
    label: {
        ...theme.textVariants.label1,
        color: theme.color.colorPrimary,
    },
    error: {
        ...theme.textVariants.label2,
        color: theme.color.danger,
        marginTop: 4,
    },
    input: {
        ...theme.textVariants.body1,
        color: '#000',
        marginTop: Platform.OS === 'ios' ? 8 : 0,
        paddingHorizontal: 8,
    },
    bottomLine: {
        height: 1,
        backgroundColor: theme.color.buttonBorderColor,
        marginTop: Platform.OS === 'ios' ? 8 : 0,
    },
});
