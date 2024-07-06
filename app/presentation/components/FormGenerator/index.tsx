import {Formik} from 'formik';
import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {FormFieldGenerator} from './FormFieldGenerator';
import {IFieldValues, IFormDynamicInput} from './model';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '@navigation/RouteParams';
import {RouteProp} from '@react-navigation/native';
import TextPrimary from '../globals/text/TextPrimary';
import {useTranslation} from 'react-i18next';
import { theme } from '@theme/index';

interface IProps {
    fields: IFormDynamicInput[];
    navigation: StackNavigationProp<AppStackParamList, any>;
    route: RouteProp<AppStackParamList, any>;
    submitTitle?: string;
    initialValues?: Record<string, IFieldValues>;
    showResetButton?: boolean;
    resetButtonTitle?: string;
    onSubmit: (values: Record<string, IFieldValues>) => void;
}

export const FormGenerator = React.memo((props: IProps) => {
    const {
        fields,
        navigation,
        route,
        submitTitle,
        showResetButton,
        resetButtonTitle,
        onSubmit,
    } = props;

    const {t} = useTranslation();

    const _fields = useMemo(
        () => fields.filter(item => item.input_type !== 'hidden'),
        [fields],
    );

    const initialValues = useMemo(() => {
        if (props.initialValues) {
            return props.initialValues;
        }
        const obj: Record<string, IFieldValues> = {};
        fields.forEach(item => {
            obj[item.id] = {
                text: item.value_text ?? '',
                value: item.value ?? '',
            };
            // if (item.type === 'fieldset' && item.items) {
            //   item.items.forEach(groupItem => {
            //     if (groupItem.value === 'group' && groupItem.items) {
            //       groupItem.items.forEach(_item => {
            //         obj[_item.id] = {
            //           text: _item.value_text ?? '',
            //           value: _item.value ?? '',
            //         };
            //       });
            //     }
            //     if (!obj[groupItem.id]) {
            //       obj[groupItem.id] = {
            //         text: item.value_text ?? '',
            //         value: item.value ?? '',
            //       };
            //     }
            //   });
            // }
        });

        return obj;
    }, [fields, props.initialValues]);

    console.log('initialValues: ', initialValues);

    return (
        <View style={styles.container}>
            <Formik<Record<string, IFieldValues>>
                initialValues={initialValues}
                enableReinitialize
                onSubmit={onSubmit}>
                {({handleSubmit, resetForm}) => {
                    return (
                        <>
                            {_fields.map(field => (
                                <FormFieldGenerator
                                    key={field.id}
                                    field={field}
                                    navigation={navigation}
                                    route={route}
                                />
                            ))}
                            <TouchableOpacity
                                style={styles.submitButton}
                                activeOpacity={0.8}
                                onPress={() => {
                                    handleSubmit();
                                }}>
                                <TextPrimary style={styles.submitText}>
                                    {submitTitle ?? t('save')}
                                </TextPrimary>
                            </TouchableOpacity>
                            {showResetButton ? (
                                <TouchableOpacity
                                    style={[
                                        styles.submitButton,
                                        {marginTop: 8},
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        resetForm({
                                            errors: {},
                                            values: {},
                                        });
                                    }}>
                                    <TextPrimary style={styles.submitText}>
                                        {resetButtonTitle ?? t('reset')}
                                    </TextPrimary>
                                </TouchableOpacity>
                            ) : null}
                        </>
                    );
                }}
            </Formik>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
    },
    submitButton: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginTop: 20,
        backgroundColor: theme.color.colorPrimary,
    },
    submitText: {
        ...theme.textVariants.body1,
        color: '#fff',
    },
});
