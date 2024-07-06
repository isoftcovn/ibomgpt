import {useField, useFormikContext} from 'formik';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {FormFieldBaseProps, IFieldValues} from '../../model';
import {IPickerItemModel} from 'app/presentation/models/general';
import {useTranslation} from 'react-i18next';
import {IBomPickerNavgationParams} from '@navigation/RouteParams';
import {PickerButton} from '@components/globals/button/PickerButton';
import TextPrimary from '@components/globals/text/TextPrimary';
import {theme} from '@theme/index';

interface IProps extends FormFieldBaseProps {}

export const FormFieldRemotePickerBox = React.memo((props: IProps) => {
    const {field, navigation} = props;
    const {label, is_required, input_type} = field;
    const pickerData = useRef<IPickerItemModel[]>([]);
    const oldFormValues = useRef<Record<string, IFieldValues>>({});
    const {t} = useTranslation();

    const multiple = useMemo(() => input_type === 'm-search-api', [input_type]);

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
    const {values} = useFormikContext<Record<string, IFieldValues>>();

    // Reset cached data if any dynamic params change value
    useEffect(() => {
        if (!field.param) {
            return;
        }
        const dynamicParams = field.param.filter(
            item => item.type === 'dynamic' && item.key !== 'key_search',
        );
        const changed = dynamicParams.some(
            item =>
                values[item.value]?.value !=
                oldFormValues.current[item.value]?.value,
        );
        if (changed) {
            pickerData.current = [];
        }

        oldFormValues.current = values;
    }, [values, field.param]);

    const selecteds: IPickerItemModel[] = useMemo(() => {
        const value = (formikField.value?.value ?? '') as string;
        if (value.length === 0) {
            return [];
        }
        const texts = formikField.value?.text.split(',') ?? [];
        const valueArr = value.split(',');
        return valueArr.map((item, index) => {
            return {
                value: item,
                text: texts[index] ?? '',
            };
        });
    }, [formikField.value]);

    const selectedText = useMemo(() => {
        if (selecteds.length === 1) {
            return selecteds[0].text;
        }
        return undefined;
    }, [selecteds]);

    const selectedList = useMemo(() => {
        if (selecteds.length > 1) {
            return selecteds.map(item => item.text);
        }
        return undefined;
    }, [selecteds]);

    const onDeleteItem = useCallback(
        (index: number) => {
            const newSelecteds = [...selecteds];
            newSelecteds.splice(index, 1);

            const ids: string[] = [];
            const texts: string[] = [];
            newSelecteds.forEach(item => {
                ids.push(`${item.value}`);
                texts.push(item.text);
            });
            helpers.setValue({
                text: texts.join(','),
                value: ids.join(','),
            });
        },
        [selecteds, helpers],
    );

    const onItemSelected = useCallback(
        (selectedValues: Record<string, IPickerItemModel>) => {
            const ids: string[] = [];
            const texts: string[] = [];
            Object.keys(selectedValues).forEach(key => {
                ids.push(`${key}`);
                texts.push(selectedValues[key].text);
            });
            helpers.setValue({
                text: texts.join(','),
                value: ids.join(','),
            });
        },
        [helpers],
    );

    const onPress = useCallback(() => {
        const formdata = new FormData();
        field.param?.forEach(item => {
            if (item.type === 'fix') {
                formdata.append(item.key, item.value);
            } else if (item.type === 'dynamic') {
                if (values[item.value]?.value) {
                    formdata.append(item.key, values[item.value]?.value);
                }
            }
        });
        const params: IBomPickerNavgationParams = {
            multiple,
            title: label,
            data: pickerData.current,
            sourceAPI: field.ref_api,
            sourceAPIParams: formdata,
            selectedItems: selecteds,
            onSubmit: onItemSelected,
            onFetchDataSuccess: data => {
                pickerData.current = data;
            },
        };
        navigation.navigate('IBomPicker', params);
    }, [navigation, field, label, multiple, values, onItemSelected, selecteds]);

    return (
        <View style={[styles.container, field.fieldContainerStyle]}>
            <PickerButton
                title={label}
                selectedText={selectedText}
                selectedList={selectedList}
                required={is_required === 1}
                onPress={onPress}
                onDeletePress={onDeleteItem}
            />
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
        fontSize: theme.fontSize.fontSizeTiny,
        color: theme.color.danger,
        marginTop: 4,
    },
    input: {
        ...theme.textVariants.body1,
        color: '#000',
        marginTop: 8,
        paddingHorizontal: 8,
    },
    bottomLine: {
        height: 1,
        backgroundColor: theme.color.colorSeparator,
        marginTop: 8,
    },
});
