import {useField} from 'formik';
import React, {useCallback} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import {FormFieldBaseProps, IFieldValues} from '../../model';
import {useTranslation} from 'react-i18next';
import {IRichTextEditorNavigationParams} from '@navigation/RouteParams';
import TextPrimary from '@components/globals/text/TextPrimary';
import {theme} from '@theme/index';
import HTMLRenderer from '@components/globals/view/HTMLRenderer';

interface IProps extends FormFieldBaseProps {}

export const FormFieldTextArea = React.memo((props: IProps) => {
    const {field, navigation} = props;
    const {label, is_required, max, min, fieldContainerStyle} = field;
    const {width} = useWindowDimensions();

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

    const navigateToRichText = useCallback(() => {
        const params: IRichTextEditorNavigationParams = {
            html: `${formikField.value?.value ?? ''}`,
            onDone: html => {
                helpers.setValue({
                    text: html,
                    value: html,
                });
            },
        };
        navigation.navigate('RichTextEditor', params);
    }, [navigation, formikField, helpers]);

    return (
        <View style={[styles.container, fieldContainerStyle]}>
            <View style={[styles.titleRow, field.fieldContentStyle]}>
                <TextPrimary style={styles.label}>
                    {label}
                    {is_required ? (
                        <TextPrimary
                            style={[styles.label, {color: theme.color.danger}]}>
                            {' '}
                            {'*'}
                        </TextPrimary>
                    ) : null}
                </TextPrimary>
                {field.fieldContentSpacerStyle && (
                    <View style={field.fieldContentSpacerStyle} />
                )}
                <TouchableOpacity
                    hitSlop={{
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10,
                    }}
                    onPress={navigateToRichText}>
                    <TextPrimary style={styles.editText}>
                        {t('edit')}
                    </TextPrimary>
                </TouchableOpacity>
            </View>
            {formikField.value?.value ? (
                <TouchableOpacity
                    style={{
                        borderWidth: StyleSheet.hairlineWidth,
                        padding: 8,
                        marginTop: 8,
                    }}
                    activeOpacity={1}
                    onPress={navigateToRichText}>
                    <HTMLRenderer
                        contentWidth={width - 32}
                        htmlContent={`${formikField.value?.value ?? ''}`}
                    />
                </TouchableOpacity>
            ) : null}
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
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editText: {
        ...theme.textVariants.label1,
        color: '#000',
    },
    label: {
        ...theme.textVariants.label1,
        color: '#000',
    },
    error: {
        ...theme.textVariants.label1,
        fontSize: theme.fontSize.fontSizeTiny,
        color: theme.color.danger,
        marginTop: 4,
    },
    input: {
        ...theme.textVariants.body1,
        color: '#000',
        marginTop: 8,
        paddingHorizontal: 8,
        height: 100,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.color.buttonBorderColor,
    },
    bottomLine: {
        height: 1,
        backgroundColor: theme.color.colorSeparator,
        marginTop: 8,
    },
});
