import {useField, useFormikContext} from 'formik';
import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {FormFieldBaseProps, IFieldValues} from '../../model';
import {FormFieldDateBox} from '../Datebox';
import {RadioButton} from '../RadioGroup/RadioButton';
import {useTranslation} from 'react-i18next';
import TextPrimary from '@components/globals/text/TextPrimary';
import {theme} from '@theme/index';

interface IProps extends FormFieldBaseProps {}

export const FormFieldSet = React.memo((props: IProps) => {
    const {field, navigation, route} = props;
    const {label, items, is_required} = field;
    const {t} = useTranslation();

    const {values, setValues} =
        useFormikContext<Record<string, IFieldValues>>();

    const validate = useCallback(
        (value: IFieldValues | undefined) => {
            const _value = (value?.value ?? '') as string;
            if (is_required && _value.length === 0) {
                return t('warn_empty');
            }
            if (_value === 'group') {
                const groupItem = items?.find(item => item.value === 'group');
                if (groupItem && groupItem.items) {
                    const isEmpty = groupItem.items.every(
                        item => !values[item.id],
                    );
                    return isEmpty ? t('warn_empty') : undefined;
                }
            }
            return undefined;
        },
        [is_required, values, items, t],
    );

    const [formikField, meta, helpers] = useField<IFieldValues | undefined>({
        name: field.id,
        validate,
    });

    const selectedItem = items?.find(
        item => item.value === formikField.value?.value,
    );

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
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
            <View style={styles.groupContainer}>
                <View style={styles.mainContentContainer}>
                    {items.map((item, index) => {
                        const {input_type} = item;
                        if (input_type === 'radio') {
                            return (
                                <RadioButton
                                    style={{
                                        marginRight:
                                            index < items.length ? 8 : 0,
                                        marginBottom: 4,
                                    }}
                                    key={item.value}
                                    title={item.label}
                                    selected={
                                        formikField.value?.value === item.value
                                    }
                                    onPress={() => {
                                        // Reset formset value when group value is unselected
                                        const newValues = {...values};
                                        newValues[field.id] = {
                                            value: item.value ?? '',
                                            text: item.label,
                                        };
                                        if (item.value !== 'group') {
                                            items
                                                .find(
                                                    _item =>
                                                        _item.value === 'group',
                                                )
                                                ?.items?.forEach(_item => {
                                                    delete newValues[_item.id];
                                                });
                                        }
                                        setValues(newValues);
                                    }}
                                />
                            );
                        }
                        return null;
                    })}
                </View>
                {selectedItem?.value === 'group' && selectedItem.items ? (
                    <View style={styles.extraViewContainer}>
                        {selectedItem.items.map((item, index) => {
                            return (
                                <View
                                    key={item.id}
                                    style={{
                                        flex: 1,
                                        marginRight:
                                            index <
                                            (selectedItem.items?.length ?? 0)
                                                ? 12
                                                : 0,
                                    }}>
                                    <FormFieldDateBox
                                        field={item}
                                        template={'column'}
                                        navigation={navigation}
                                        route={route}
                                    />
                                </View>
                            );
                        })}
                    </View>
                ) : null}
            </View>
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
        ...theme.textVariants.body2,
        color: theme.color.colorPrimary,
    },
    error: {
        ...theme.textVariants.body3,
        color: theme.color.danger,
        marginTop: 4,
    },
    groupContainer: {
        borderWidth: StyleSheet.hairlineWidth,
        color: theme.color.buttonBorderColor,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginTop: 8,
    },
    mainContentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    extraViewContainer: {
        flexDirection: 'row',
        marginTop: 6,
    },
});
