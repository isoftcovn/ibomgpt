import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Dimensions } from '@theme/Dimensions';
import { theme } from 'app/presentation/theme';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InteractionManager, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { HomeHeader } from './components/HomeHeader';
import { ChatListRequestModel } from '@models/chat/request/ChatListRequestModel';
import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';
import { ListState } from 'app/presentation/models/general';
import { GetChatListUseCase } from '@domain/chat/GetChatListUseCase';
import { ChatRepository } from '@data/repository/chat';
import Utilities from '@shared/helper/utilities';
import ListingHelper from '@shared/helper/ListingHelper';
import { MyFlatList } from '@components/index';
import { ChatListItem } from './components/ChatListItem';

interface IProps {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<any, any>;
}

const HomeScreen = (props: IProps) => {
    const { navigation, route } = props;
    const [searchTerm, setSearchTerm] = useState('');
    const [listState, setListState] = useState<ListState>(ListState.initial);
    const [conversations, setConversations] = useState<ChatItemResponse[]>([]);
    const chatListRequest = useRef<ChatListRequestModel>(new ChatListRequestModel());
    const canLoadMore = useRef<boolean>(false);

    const onChangeText = useCallback((text: string) => {
        setSearchTerm(text);
    }, []);

    const loadData = useCallback(async (refreshing: boolean = false) => {
        try {
            setListState(refreshing ? ListState.refreshing : ListState.loading);
            chatListRequest.current = new ChatListRequestModel();
            const usecase = new GetChatListUseCase(new ChatRepository(), chatListRequest.current);
            const items = await usecase.execute();
            setConversations(items);
            canLoadMore.current = items.length >= chatListRequest.current.limit;
        } catch (error) {
            console.info('Load conversations error: ', error);
        } finally {
            setListState(ListState.done);
        }
    }, []);

    const loadMoreData = useCallback(async () => {
        if (!canLoadMore.current) {
            return;
        }
        if (listState !== ListState.done && listState !== ListState.initial) {
            return;
        }
        try {
            setListState(ListState.loadingMore);
            chatListRequest.current.page = ListingHelper.shared.getNextPageBasedOnDataLength(conversations.length, chatListRequest.current.limit) ?? chatListRequest.current.page + 1;
            const usecase = new GetChatListUseCase(new ChatRepository(), chatListRequest.current);
            const items = await usecase.execute();
            setConversations(prevState => {
                return [
                    ...prevState,
                    ...items
                ];
            });
            canLoadMore.current = items.length >= chatListRequest.current.limit;
        } catch (error) {
            console.info('Load conversations error: ', error);
        } finally {
            setListState(ListState.done);
        }
    }, [listState, conversations]);

    const onItemPress = useCallback((data: ChatItemResponse) => {
        // TODO: Navigate to chat screen
    }, [navigation]);

    const renderItem = useCallback((info: ListRenderItemInfo<ChatItemResponse>) => {
        return <ChatListItem
            data={info.item}
            onPress={onItemPress}
        />;
    }, [onItemPress]);

    // Did mount
    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            loadData();
        });
    }, [loadData]);

    return <View style={styles.container}
    >
        <HomeHeader
            onChangeText={onChangeText}
        />
        <MyFlatList
            style={styles.list}
            data={conversations}
            isLoading={listState === ListState.loading}
            refreshing={listState === ListState.refreshing}
            isLoadMore={listState === ListState.loadingMore}
            separatorType={'line'}
            renderItem={renderItem}
            keyExtractor={(item: ChatItemResponse) => `${item.objectId}-${item.objectInstanceId}`}
            onRefresh={() => loadData(true)}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.7}
        />
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorPrimary,
    },
    list: {
        flex: 1
    }
});

export default HomeScreen;
