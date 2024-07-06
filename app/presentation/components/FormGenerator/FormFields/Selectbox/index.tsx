import { useField } from 'formik';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Menu } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FormFieldBaseProps, IFieldValues } from '../../model';
import { useTranslation } from 'react-i18next';
import TextPrimary from '@components/globals/text/TextPrimary';
import { theme } from '@theme/index';

interface IProps extends FormFieldBaseProps {}

export const FormFieldSelectBox = React.memo((props: IProps) => {
    const { field } = props;
    const { label, is_required, options } = field;
    const [pickerVisible, setPickerVisible] = useState(false);
    const [menuWidth, setMenuWidth] = useState(300);
    const menuOptions = useMemo(() => options ?? [], [options]);
    const didSelectInitialOption = useRef(false);

    const {t} = useTranslation();

    const validate = useCallback(
        (value: IFieldValues | undefined) => {
            const _value = value?.value ? parseInt(`${value?.value ?? ''}`, 10) : undefined;
            if (is_required && !_value) {
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
        if (didSelectInitialOption.current || formikField.value?.value) {
            return;
        }
        const initialOption = menuOptions.find((item) => item.is_selected === 1);
        if (initialOption) {
            helpers.setValue({
                text: initialOption.text,
                value: initialOption.id,
            });
            didSelectInitialOption.current = true;
        }
    }, [menuOptions, helpers, formikField]);

    useEffect(() => {
        if (formikField.value?.value && !formikField.value?.text) {
            const selectedValue = `${formikField.value?.value ?? ''}`;
            const initialOption = menuOptions.find((item) => `${item.id}` === selectedValue);
            if (initialOption) {
                helpers.setValue({
                    text: initialOption.text,
                    value: initialOption.id,
                });
            }
        }
    }, [menuOptions, helpers, formikField]);

    return (
        <View style={[styles.container, field.fieldContainerStyle]}>
            <TextPrimary style={styles.label}>
                {label}
                {is_required ? <TextPrimary style={[styles.label, { color: theme.color.danger }]}> {'*'}</TextPrimary> : null}
            </TextPrimary>
            <Menu
                style={{
                    width: menuWidth,
                }}
                contentStyle={{
                    backgroundColor: theme.color.backgroundColorPrimary,
                }}
                visible={pickerVisible}
                onDismiss={() => setPickerVisible(false)}
                anchorPosition={'bottom'}
                anchor={
                    <TouchableOpacity
                        style={styles.selectbox}
                        activeOpacity={0.8}
                        onPress={() => setPickerVisible(true)}
                        onLayout={(event) => {
                            setMenuWidth(event.nativeEvent.layout.width);
                        }}
                    >
                        <TextPrimary style={styles.value}>{formikField.value?.text || t('select')}</TextPrimary>
                        <Ionicons name={'caret-down-outline'} size={18} />
                    </TouchableOpacity>
                }
            >
                {menuOptions.map((item) => {
                    return (
                        <Menu.Item
                            key={`${item.id}`}
                            rippleColor={'transparent'}
                            style={{
                                width: menuWidth,
                                maxWidth: menuWidth,
                            }}
                            contentStyle={{
                                width: menuWidth - 56,
                                maxWidth: menuWidth - 56,
                            }}
                            titleStyle={{
                                ...theme.textVariants.body2,
                            }}
                            trailingIcon={formikField.value?.value === item.id ? 'check' : undefined}
                            title={item.text}
                            onPress={() => {
                                helpers.setValue({
                                    text: item.text,
                                    value: item.id,
                                });
                                setPickerVisible(false);
                            }}
                        />
                    );
                })}
            </Menu>
            {meta.error && meta.touched ? <TextPrimary style={[styles.error]}>{meta.error}</TextPrimary> : null}
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
    selectbox: {
        borderRadius: 20,
        height: 40,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: theme.color.buttonBorderColor,
        alignItems: 'center',
        marginTop: 8,
        flexDirection: 'row',
    },
    value: {
        ...theme.textVariants.body2,
        color: '#000',
        flex: 1,
    },
});
