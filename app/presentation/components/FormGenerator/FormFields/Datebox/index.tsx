import {useField} from 'formik';
import dayjs from 'dayjs';
import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {FormFieldBaseProps, IFieldValues} from '../../model';
import {useTranslation} from 'react-i18next';
import TextPrimary from '@components/globals/text/TextPrimary';
import {theme} from '@theme/index';

interface IProps extends FormFieldBaseProps {
    template: 'row' | 'column';
}

export const FormFieldDateBox = React.memo((props: IProps) => {
    const {field, template} = props;
    const {label, is_required} = field;
    const [pickerVisible, setPickerVisible] = useState(false);
    const {t} = useTranslation();
    const dateFormat = useMemo(
        () => field.format_date ?? 'DD/MM/YYYY',
        [field.format_date],
    );

    const validate = useCallback(
        (value: IFieldValues | undefined) => {
            const date = `${value?.value ?? ''}`;
            if (is_required && date.length === 0) {
                return t('warn_empty');
            }

            return undefined;
        },
        [is_required, t],
    );

    const [formikField, meta, helpers] = useField<IFieldValues | undefined>({
        name: field.id,
        validate,
    });

    const dateValue = useMemo(() => {
        const dateStr = `${formikField.value?.value ?? ''}`;
        const date = dayjs(dateStr, dateFormat);
        return date.isValid() ? date.toDate() : undefined;
    }, [dateFormat, formikField.value]);

    const dateText = useMemo(() => {
        return `${formikField.value?.value ?? ''}`;
    }, [formikField.value]);

    const onConfirm = useCallback(
        (date: Date) => {
            const dateStr = dayjs(date).format(dateFormat);
            helpers.setValue({
                text: dateStr,
                value: dateStr,
            });
            setPickerVisible(false);
        },
        [helpers, dateFormat],
    );

    return (
        <View style={[styles.container, field.fieldContainerStyle]}>
            <View
                style={[
                    template === 'column' ? styles.column : styles.row,
                    field.fieldContentStyle,
                ]}>
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
                    style={[
                        styles.datebox,
                        {
                            marginTop: template === 'column' ? 8 : 0,
                            paddingHorizontal: template === 'column' ? 8 : 20,
                        },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setPickerVisible(true)}>
                    <TextPrimary style={styles.dateText}>
                        {dateText || dateFormat}
                    </TextPrimary>
                </TouchableOpacity>
            </View>
            {meta.error && meta.touched ? (
                <TextPrimary style={[styles.error]}>{meta.error}</TextPrimary>
            ) : null}
            <DateTimePickerModal
                isVisible={pickerVisible}
                mode={'date'}
                date={dateValue}
                onCancel={() => {
                    setPickerVisible(false);
                }}
                onConfirm={onConfirm}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        marginVertical: 8,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {},
    label: {
        ...theme.textVariants.body2,
        color: theme.color.colorPrimary,
    },
    error: {
        ...theme.textVariants.body3,
        color: theme.color.danger,
        marginTop: 4,
    },
    datebox: {
        borderRadius: 20,
        height: 40,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: theme.color.buttonBorderColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateText: {
        ...theme.textVariants.body2,
        color: '#000',
    },
});
