import {FormGenerator} from '@components/FormGenerator';
import {IFieldValues, IFormDynamicInput} from '@components/FormGenerator/model';
import {ChatRepository} from '@data/repository/chat';
import {AppStackParamList} from '@navigation/RouteParams';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import DropDownHolder from '@shared/helper/DropdownHolder';
import {theme} from '@theme/index';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'CommonFilter'>;
    route: RouteProp<AppStackParamList, 'CommonFilter'>;
}

export const CommonFilter = (props: IProps) => {
    const {navigation, route} = props;
    const initialFilters = useRef<Record<string, IFieldValues>>(
        route.params.initialFilters ?? {},
    );
    const refAPI = useRef<string>('');
    const [inputs, setInputs] = useState<IFormDynamicInput[]>([]);
    const {t} = useTranslation();

    useEffect(() => {
        navigation.setOptions({
            title: route.params.title ?? t('filter'),
        });
    }, [navigation, route.params, t]);

    useEffect(() => {
        const repo = new ChatRepository();
        repo.getChatSearchForm()
            .then(resp => {
                refAPI.current = resp.submit_api?.ref_api;
                setInputs(resp.items ?? []);
            })
            .catch(error => {
                DropDownHolder.showErrorAlert(error?.message ?? '');
            });
    }, []);

    const onSubmit = useCallback(
        (values: Record<string, IFieldValues>) => {
            const _onSubmit = route.params.onSubmit;
            _onSubmit(values, refAPI.current);
        },
        [route],
    );

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.contentContainer}
                style={{flex: 1}}>
                <FormGenerator
                    fields={inputs}
                    navigation={navigation}
                    route={route}
                    initialValues={initialFilters.current}
                    showResetButton
                    submitTitle={t('search')}
                    resetButtonTitle={t('cancel')}
                    onSubmit={onSubmit}
                />
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorPrimary,
    },
    contentContainer: {
        paddingTop: theme.spacing.medium,
        paddingHorizontal: theme.spacing.medium,
        paddingBottom: 50,
        alignItems: 'stretch',
    },
});
