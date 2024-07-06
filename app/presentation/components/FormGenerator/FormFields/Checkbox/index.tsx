import { Text } from '@app/components/Text';
import { IFormSelectInputOption } from '@app/constants/Api.interfaces';
import * as theme from '@app/constants/Theme';
import I18n from '@app/i18n/i18n';
import { useField } from 'formik';
import chunk from 'lodash.chunk';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { FormFieldBaseProps, IFieldValues } from '../../model';
import { CheckboxItem } from './CheckboxItem';

interface IProps extends FormFieldBaseProps {}

const MAX_ITEM_PER_ROW = 3;

export const FormFieldCheckBox = React.memo((props: IProps) => {
    const { field } = props;
    const { label, is_required, options } = field;
    const didSelectInitialOption = useRef(false);
    const checkboxOptions = useMemo(() => {
        const _options = options ?? [];
        return chunk(_options, MAX_ITEM_PER_ROW);
    }, [options]);

    const validate = useCallback(
        (value: IFieldValues | undefined) => {
            const _value = `${value?.value ?? ''}`;
            if (is_required && _value.length === 0) {
                return I18n.t('warn_empty');
            }

            return undefined;
        },
        [is_required],
    );

    const [formikField, meta, helpers] = useField<IFieldValues | undefined>({
        name: field.id,
        validate,
    });

    useEffect(() => {
        if (didSelectInitialOption.current) {
            return;
        }
        const initialOptions = options?.filter((item) => item.is_selected === 1) ?? [];
        if (initialOptions.length > 0) {
            const selectedArr = initialOptions.map((item) => `${item.id}`);
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
        selectedArr.forEach((item) => (obj[item] = true));

        return obj;
    }, [formikField.value]);

    const onItemPress = useCallback(
        (item: IFormSelectInputOption) => {
            const selectedStr = `${formikField.value?.value ?? ''}`;
            const selectedArr = selectedStr.split(',');
            const index = selectedArr.findIndex((arrItem) => arrItem === `${item.id}`);
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
            <Text style={styles.label}>
                {label}
                {is_required ? <Text style={[styles.label, { color: theme.colors.red }]}> {'*'}</Text> : null}
            </Text>
            {checkboxOptions.map((rowData, rowIndex) => {
                return (
                    <View
                        key={`${rowIndex}`}
                        style={[
                            styles.checkboxRow,
                            {
                                marginBottom: rowIndex < checkboxOptions.length - 1 ? 8 : 0,
                            },
                            field.fieldContentStyle
                        ]}
                    >
                        {rowData.map((item, index) => {
                            return (
                                <CheckboxItem
                                    key={`${item.id}`}
                                    style={[
                                        styles.checkboxItem,
                                        {
                                            marginRight: index < rowData.length - 1 ? 12 : 0,
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
            {meta.error && meta.touched ? <Text style={[styles.error]}>{meta.error}</Text> : null}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        marginVertical: 8,
    },
    label: {
        ...theme.fonts.regular14,
        color: theme.colors.active,
    },
    error: {
        ...theme.fonts.regular12,
        color: theme.colors.red,
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
