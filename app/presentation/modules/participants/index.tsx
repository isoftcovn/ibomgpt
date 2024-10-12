import {HTMLRenderer, MyFlatList, TextPrimary} from '@components/index';
import UserModel from '@models/user/response/UserModel';
import {AppStackParamList} from '@navigation/RouteParams';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {selectParticipantsByKey} from '@redux/selectors/conversation';
import {theme} from '@theme/index';
import React, {useCallback, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ListRenderItemInfo, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ParticipantItemView} from './components/ParticipantItem';
import {Dimensions} from '@theme/Dimensions';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'ParticipantList'>;
    route: RouteProp<AppStackParamList, 'ParticipantList'>;
}

export const ParticipantList = (props: IProps) => {
    const {navigation, route} = props;

    const objectId = useMemo(() => {
        return route.params.objectId;
    }, [route.params]);
    const objectInstanceId = useMemo(() => {
        return route.params.objectInstanceId;
    }, [route.params]);
    const key = useMemo(() => {
        return `${objectId}-${objectInstanceId}`;
    }, [objectId, objectInstanceId]);
    const participants = useSelector(state =>
        selectParticipantsByKey(state, key),
    );
    const options = route.params.info;

    const {t} = useTranslation();

    useEffect(() => {
        navigation.setOptions({
            title: t('info2'),
        });
    }, [navigation, t]);

    const renderItem = useCallback((info: ListRenderItemInfo<UserModel>) => {
        const {index, item} = info;
        return (
            <ParticipantItemView index={index} item={item} onPress={() => {}} />
        );
    }, []);

    const renderHeader = useCallback(() => {
        if (!options) {
            return null;
        }
        return (
            <View style={styles.infoContainer}>
                <TextPrimary variant="body1" style={styles.infoText}>
                    {options.name}
                </TextPrimary>
                {options?.infoHTML && (
                    <HTMLRenderer
                        contentWidth={
                            Dimensions.screenWidth() - theme.spacing.medium * 2
                        }
                        htmlContent={options?.infoHTML ?? ''}
                    />
                )}
                <TextPrimary variant="body1" style={styles.infoText}>{`${t(
                    'allMemberNumber',
                )}: ${participants.length}`}</TextPrimary>
            </View>
        );
    }, [options, t, participants.length]);

    return (
        <View style={styles.container}>
            <MyFlatList
                style={styles.list}
                contentContainerStyle={styles.contentContainer}
                data={participants}
                separatorType={'line'}
                ListHeaderComponent={renderHeader}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorPrimary,
    },
    contentContainer: {},
    infoContainer: {
        paddingVertical: theme.spacing.small,
        paddingHorizontal: theme.spacing.medium,
        backgroundColor: theme.color.backgroundColorVariant,
        gap: theme.spacing.small,
    },
    infoText: {
        color: theme.color.colorPrimary,
        fontWeight: '500',
    },
    list: {
        flex: 1,
    },
});
