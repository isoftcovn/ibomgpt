import { MyFlatList, TextButton, TextPrimary } from '@components/index';
import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';
import UserModel from '@models/user/response/UserModel';
import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { selectConversationByKey, selectParticipantsByKey } from '@redux/selectors/conversation';
import { theme } from '@theme/index';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'ConversationInfo'>
    route: RouteProp<AppStackParamList, 'ConversationInfo'>;
}

export const ConversationInfo = (props: IProps) => {
    const { navigation, route } = props;

    const objectId = useMemo(() => { return route.params.objectId; }, [route.params]);
    const objectInstanceId = useMemo(() => { return route.params.objectInstanceId; }, [route.params]);
    const key = useMemo(() => { return `${objectId}-${objectInstanceId}`; }, [objectId, objectInstanceId]);
    const conversation = useSelector((state: any) => selectConversationByKey(state, key));

    const { t } = useTranslation();

    useEffect(() => {
        navigation.setOptions({
            title: t('groupInfo'),
        })
    }, [navigation, t]);


    return <View style={styles.container}>
        <TextPrimary style={{
            fontWeight: '500',
        }}>{`${t('objectType')}: ${conversation?.companyId ?? ''}`}</TextPrimary>
        <TextPrimary style={{
            marginTop: theme.spacing.tiny,
            fontWeight: '500',
        }}>{`${t('objectName')}: ${conversation?.name ?? ''}`}</TextPrimary>
        <TextButton
            containerStyle={{
                marginTop: theme.spacing.medium,
            }}
            title={t('detail')}
        />
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorPrimary,
        paddingVertical: theme.spacing.extraLarge,
        paddingHorizontal: theme.spacing.large,
    },

});
