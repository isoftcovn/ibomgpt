import { MyFlatList } from '@components/index';
import { ChatRepository } from '@data/repository/chat';
import { GetChatListUseCase } from '@domain/chat/GetChatListUseCase';
import { ChatListRequestModel } from '@models/chat/request/ChatListRequestModel';
import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';
import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ListingHelper from '@shared/helper/ListingHelper';
import { ListState } from 'app/presentation/models/general';
import { theme } from 'app/presentation/theme';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InteractionManager, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { BehaviorSubject, debounceTime, skip } from 'rxjs';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'Conversation'>;
    route: RouteProp<AppStackParamList, 'Conversation'>;
}

export const ConversationScreen = (props: IProps) => {
    const { navigation, route } = props;
    const { t } = useTranslation();

    useEffect(() => {
        const name = route.params?.name ?? '';
        navigation.setOptions({
            title: name || `${t('detail')}:${route.params?.objectInstanceId ?? 0}`
        });
    }, [route.params, navigation, t]);

    return <View style={styles.container}>

    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
