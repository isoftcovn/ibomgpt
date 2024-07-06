import {useField} from 'formik';
import chunk from 'lodash.chunk';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {
    FormFieldBaseProps,
    IFieldValues,
    IFormSelectInputOption,
} from '../../model';
import {CheckboxItem} from './CheckboxItem';
import TextPrimary from '@components/globals/text/TextPrimary';
import {theme} from '@theme/index';
import {useTranslation} from 'react-i18next';

interface IProps extends FormFieldBaseProps {}

const MAX_ITEM_PER_ROW = 3;

export const FormFieldCheckBox = React.memo((props: IProps) => {
    const {field} = props;
    const {label, is_required, options} = field;
    const didSelectInitialOption = useRef(false);
    const {t} = useTranslation();
    const checkboxOptions = useMemo(() => {
        const _options = options ?? [];
        return chunk(_options, MAX_ITEM_PER_ROW);
    }, [options]);

    const validate = useCallback(
        (value: IFieldValues | undefined) => {
            const _value = `${value?.value ?? ''}`;
            if (is_required && _value.length === 0) {
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

    useEffect(() => {
        if (didSelectInitialOption.current) {
            return;
        }
        const initialOptions =
            options?.filter(item => item.is_selected === 1) ?? [];
        if (initialOptions.length > 0) {
            const selectedArr = initialOptions.map(item => `${item.id}`);
            const selectedStr = selectedArr.join(',');
            helpers.setValue({
                value: selectedStr,
                text: selectedStr,
            });
            didSelectInitialOption.current = true;
        }
    }, [options, helpers]);

    const selecteds = useMemo(() => {
        const selectedStr = `${formikField.value?.value ?? ''}`;
        const selectedArr = selectedStr.split(',');
        const obj: Record<string, boolean> = {};
        selectedArr.forEach(item => (obj[item] = true));

        return obj;
    }, [formikField.value]);

    const onItemPress = useCallback(
        (item: IFormSelectInputOption) => {
            const selectedStr = `${formikField.value?.value ?? ''}`;
            const selectedArr = selectedStr.split(',');
            const index = selectedArr.findIndex(
                arrItem => arrItem === `${item.id}`,
            );
            if (index === -1) {
                selectedArr.push(`${item.id}`);
            } else {
                selectedArr.splice(index, 1);
            }
            helpers.setValue({
                value: selectedArr.join(','),
                text: selectedArr.join(','),
            });
        },
        [formikField.value, helpers],
    );

    return (
        <View style={[styles.container, field.fieldContainerStyle]}>
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
            {checkboxOptions.map((rowData, rowIndex) => {
                return (
                    <View
                        key={`${rowIndex}`}
                        style={[
                            styles.checkboxRow,
                            {
                                marginBottom:
                                    rowIndex < checkboxOptions.length - 1
                                        ? 8
                                        : 0,
                            },
                            field.fieldContentStyle,
                        ]}>
                        {rowData.map((item, index) => {
                            return (
                                <CheckboxItem
                                    key={`${item.id}`}
                                    style={[
                                        styles.checkboxItem,
                                        {
                                            marginRight:
                                                index < rowData.length - 1
                                                    ? 12
                                                    : 0,
                                        },
                                    ]}
                                    selected={selecteds[item.id]}
                                    title={item.text}
                                    onPress={() => onItemPress(item)}
                                />
                            );
                        })}
                    </View>
                );
            })}
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
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    checkboxItem: {},
});
