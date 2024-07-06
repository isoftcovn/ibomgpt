import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FormFieldBaseProps} from '../../model';
import {FormFieldCheckBox} from '../Checkbox';
import {FormFieldDateBox} from '../Datebox';
import {FormFieldFileBox} from '../FilePicker';
import {FormFieldRemotePickerBox} from '../RemotePicker';
import {FormFieldSelectBox} from '../Selectbox';
import {FormFieldTextArea} from '../TextArea';
import {FormFieldTextBox} from '../TextBox';
import TextPrimary from '@components/globals/text/TextPrimary';
import {theme} from '@theme/index';

interface IProps extends FormFieldBaseProps {}

export const FormFieldsGroup = React.memo((props: IProps) => {
    const {field, navigation, route} = props;
    const {label, items, is_required} = field;

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
                <View
                    style={[
                        styles.mainContentContainer,
                        field.groupContainerStyle,
                    ]}>
                    {items.map((item, index) => {
                        const {input_type} = item;
                        if (input_type === 'textbox') {
                            return (
                                <FormFieldTextBox
                                    field={item}
                                    navigation={navigation}
                                    route={route}
                                />
                            );
                        }

                        if (input_type === 'textarea') {
                            return (
                                <FormFieldTextArea
                                    field={item}
                                    navigation={navigation}
                                    route={route}
                                />
                            );
                        }

                        if (input_type === 'datebox') {
                            return (
                                <FormFieldDateBox
                                    template={'row'}
                                    field={item}
                                    navigation={navigation}
                                    route={route}
                                />
                            );
                        }

                        if (input_type === 'selectbox') {
                            return (
                                <FormFieldSelectBox
                                    field={item}
                                    navigation={navigation}
                                    route={route}
                                />
                            );
                        }

                        if (input_type === 'checkbox') {
                            return (
                                <FormFieldCheckBox
                                    field={item}
                                    navigation={navigation}
                                    route={route}
                                />
                            );
                        }

                        if (input_type === 'm-file') {
                            return (
                                <FormFieldFileBox
                                    field={item}
                                    navigation={navigation}
                                    route={route}
                                />
                            );
                        }

                        if (
                            input_type === 'search-api' ||
                            input_type === 'm-search-api'
                        ) {
                            return (
                                <FormFieldRemotePickerBox
                                    field={item}
                                    navigation={navigation}
                                    route={route}
                                />
                            );
                        }
                        return null;
                    })}
                </View>
            </View>
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
    groupContainer: {
        borderWidth: StyleSheet.hairlineWidth,
        color: theme.color.buttonBorderColor,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginTop: 8,
    },
    mainContentContainer: {},
    extraViewContainer: {
        flexDirection: 'row',
        marginTop: 6,
    },
});
