import { MyFlatList } from '@components/index';
import { ChatRepository } from '@data/repository/chat';
import { GetChatListUseCase } from '@domain/chat/GetChatListUseCase';
import { ChatListRequestModel } from '@models/chat/request/ChatListRequestModel';
import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ListingHelper from '@shared/helper/ListingHelper';
import { ListState } from 'app/presentation/models/general';
import { theme } from 'app/presentation/theme';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InteractionManager, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { BehaviorSubject, Subscription, debounceTime, skip } from 'rxjs';
import { ChatListItem } from './components/ChatListItem';
import { HomeHeader } from './components/HomeHeader';
import { AppStackParamList } from '@navigation/RouteParams';
import UserModel from '@models/user/response/UserModel';
import { selectProfile } from '@redux/selectors/user';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileActionTypes } from '@redux/actions/user';
import AnalyticsHelper from 'app/shared/helper/AnalyticsHelper';
import { ChatManager } from 'app/presentation/managers/ChatManager';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'HomeTab'>;
    route: RouteProp<AppStackParamList, 'HomeTab'>;
}

const HomeScreen = (props: IProps) => {
    const { navigation } = props;
    const dispatch = useDispatch();
    const searchTermRef = useRef<BehaviorSubject<string>>(new BehaviorSubject(''));
    const didMountRef = useRef(false);
    const receiveMessageSubcription = useRef<Subscription | undefined>();
    const [listState, setListState] = useState<ListState>(ListState.initial);
    const [conversations, setConversations] = useState<ChatItemResponse[]>([]);
    const user: UserModel | undefined = useSelector(selectProfile).data;
    const chatListRequest = useRef<ChatListRequestModel>(new ChatListRequestModel());
    const canLoadMore = useRef<boolean>(false);

    useEffect(() => {
        if (user) {
            AnalyticsHelper.setUser(user);
        }
    }, [user]);

    useEffect(() => {
        ChatManager.shared.startConnection();
        receiveMessageSubcription.current = ChatManager.shared.receiveMessageEvent.subscribe(messages => {

        });

        return () => {
            ChatManager.shared.stopConnection();
            receiveMessageSubcription.current?.unsubscribe();
        };
    }, []);

    const onChangeText = useCallback((text: string) => {
        searchTermRef.current.next(text);
    }, []);

    const loadData = useCallback(async (refreshing: boolean = false, searchTerm: string = '') => {
        try {
            setListState(refreshing ? ListState.refreshing : ListState.loading);
            chatListRequest.current = new ChatListRequestModel();
            if (searchTerm && searchTerm.length > 0) {
                chatListRequest.current.keysearch = searchTerm;
            }
            const usecase = new GetChatListUseCase(new ChatRepository(), chatListRequest.current);
            const response = await usecase.execute();
            setConversations(response.items);
            canLoadMore.current = response.items.length >= chatListRequest.current.limit;

            if (response.avatar && user) {
                dispatch(getProfileActionTypes.successAction({
                    ...user,
                    avatar: response.avatar
                }));
            }
        } catch (error) {
            console.info('Load conversations error: ', error);
        } finally {
            setListState(ListState.done);
        }
    }, [user, dispatch]);

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
            const response = await usecase.execute();
            const items = response.items;
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
        navigation.navigate('Conversation', {
            objectId: data.objectId,
            objectInstanceId: data.objectInstanceId,
            name: data.name,
        });
    }, [navigation]);

    const renderItem = useCallback((info: ListRenderItemInfo<ChatItemResponse>) => {
        return <ChatListItem
            data={info.item}
            onPress={onItemPress}
        />;
    }, [onItemPress]);

    // Did mount
    useEffect(() => {
        if (!didMountRef.current) {
            InteractionManager.runAfterInteractions(() => {
                loadData();
            });
            didMountRef.current = true;
        }
    }, [loadData]);

    useEffect(() => {
        const subscription = searchTermRef.current.pipe(skip(1), debounceTime(500))
            .subscribe(searchTerm => {
                console.info('Debounce search term: ', searchTerm);
                loadData(false, searchTerm);
            });

        return () => {
            subscription.unsubscribe();
        };
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
