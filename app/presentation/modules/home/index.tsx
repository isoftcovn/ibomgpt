import {IFieldValues} from '@components/FormGenerator/model';
import {TextPrimary} from '@components/index';
import {ChatRepository} from '@data/repository/chat';
import {GetChatListUseCase} from '@domain/chat/GetChatListUseCase';
import {ChatListRequestModel} from '@models/chat/request/ChatListRequestModel';
import {ChatItemResponse} from '@models/chat/response/ChatItemResponse';
import UserModel from '@models/user/response/UserModel';
import {useRealtimeMessage} from '@modules/conversation/hooks/CommonHooks';
import {AppStackParamList} from '@navigation/RouteParams';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {getConversationsActionTypes} from '@redux/actions/conversation';
import {getProfileActionTypes} from '@redux/actions/user';
import {selectConversationList} from '@redux/selectors/conversation';
import {selectProfile} from '@redux/selectors/user';
import ListingHelper from '@shared/helper/ListingHelper';
import AppManager from '@shared/managers/AppManager';
import {ChatManager} from 'app/presentation/managers/ChatManager';
import {ListState} from 'app/presentation/models/general';
import {theme} from 'app/presentation/theme';
import AnalyticsHelper from 'app/shared/helper/AnalyticsHelper';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    ActivityIndicator,
    DeviceEventEmitter,
    InteractionManager,
    ListRenderItemInfo,
    StyleSheet,
    View,
} from 'react-native';
import Animated, {LinearTransition} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {BehaviorSubject, debounceTime, skip} from 'rxjs';
import {ChatListItem} from './components/ChatListItem';
import {HomeHeader} from './components/HomeHeader';
import {useConversations} from './hooks';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'HomeScreen'>;
    route: RouteProp<AppStackParamList, 'HomeScreen'>;
}

const ListSeparator = React.memo(() => {
    return <View style={styles.lineSeparator} />;
});

const HomeScreen = (props: IProps) => {
    const {navigation} = props;
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const searchTermRef = useRef<BehaviorSubject<string>>(
        new BehaviorSubject(''),
    );
    const needToRefreshData = useRef(false);
    const didMountRef = useRef(false);
    const [listState, setListState] = useState<ListState>(ListState.initial);
    const conversations: ChatItemResponse[] = useSelector(
        selectConversationList,
    );
    const sortedConversations = useConversations(conversations);
    const user: UserModel | undefined = useSelector(selectProfile).data;
    const userId = useMemo(() => user?.id, [user]);
    const chatListRequest = useRef<ChatListRequestModel>(
        new ChatListRequestModel(),
    );
    const canLoadMore = useRef<boolean>(false);
    const isLoading = useMemo(
        () => listState === ListState.loading,
        [listState],
    );
    const isLoadMore = useMemo(
        () => listState === ListState.loadingMore,
        [listState],
    );
    const refreshing = useMemo(
        () => listState === ListState.refreshing,
        [listState],
    );
    useRealtimeMessage();

    useEffect(() => {
        DeviceEventEmitter.emit('credentialsReadyForUnauth');
    }, []);

    useEffect(() => {
        if (user) {
            AnalyticsHelper.setUser(user);
        }
    }, [user]);

    useEffect(() => {
        if (userId) {
            ChatManager.shared.startConnection(`${userId}`);
        }

        return () => {
            ChatManager.shared.stopConnection();
        };
    }, [userId]);

    const onChangeText = useCallback((text: string) => {
        searchTermRef.current.next(text);
    }, []);

    const onFilterChange = useCallback(
        (values: Record<string, IFieldValues>, refAPI: string) => {
            setTimeout(() => {
                navigation.navigate('ObjectList', {
                    values,
                    refAPI,
                    title: values.object_id?.text ?? '',
                });
            }, 200);
        },
        [navigation],
    );

    const loadData = useCallback(
        async (isRefreshing: boolean = false, searchTerm: string = '') => {
            try {
                setListState(
                    isRefreshing ? ListState.refreshing : ListState.loading,
                );
                chatListRequest.current = new ChatListRequestModel();
                if (searchTerm && searchTerm.length > 0) {
                    chatListRequest.current.key_search = searchTerm;
                }
                const usecase = new GetChatListUseCase(
                    new ChatRepository(),
                    chatListRequest.current,
                );
                const response = await usecase.execute();
                canLoadMore.current =
                    response.items.length >= chatListRequest.current.limit;
                dispatch(
                    getConversationsActionTypes.successAction(response.items, {
                        canLoadMore: canLoadMore.current,
                    }),
                );
                // setConversations(response.items);

                if (response.avatar && user) {
                    dispatch(
                        getProfileActionTypes.successAction({
                            ...user,
                            avatar: response.avatar,
                        }),
                    );
                }
            } catch (error) {
                console.info('Load conversations error: ', error);
            } finally {
                setListState(ListState.done);
            }
        },
        [user, dispatch],
    );

    const loadMoreData = useCallback(async () => {
        if (!canLoadMore.current) {
            return;
        }
        if (listState !== ListState.done && listState !== ListState.initial) {
            return;
        }
        try {
            setListState(ListState.loadingMore);
            chatListRequest.current.page =
                ListingHelper.shared.getNextPageBasedOnDataLength(
                    conversations.length,
                    chatListRequest.current.limit,
                ) ?? chatListRequest.current.page + 1;
            const usecase = new GetChatListUseCase(
                new ChatRepository(),
                chatListRequest.current,
            );
            const response = await usecase.execute();
            const items = response.items;
            canLoadMore.current = items.length >= chatListRequest.current.limit;
            dispatch(
                getConversationsActionTypes.successAction(items, {
                    canLoadMore: canLoadMore.current,
                    isAppend: true,
                }),
            );
            // setConversations(prevState => {
            //     return [
            //         ...prevState,
            //         ...items
            //     ];
            // });
        } catch (error) {
            console.info('Load conversations error: ', error);
        } finally {
            setListState(ListState.done);
        }
    }, [listState, dispatch, conversations]);

    const onItemPress = useCallback(
        (data: ChatItemResponse) => {
            navigation.navigate('Conversation', {
                objectId: data.objectId,
                objectInstanceId: data.objectInstanceId,
                name: data.name,
            });
        },
        [navigation],
    );

    const renderItem = useCallback(
        (info: ListRenderItemInfo<ChatItemResponse>) => {
            return <ChatListItem data={info.item} onPress={onItemPress} />;
        },
        [onItemPress],
    );

    // Did mount
    useEffect(() => {
        if (!didMountRef.current) {
            InteractionManager.runAfterInteractions(() => {
                loadData();
            });
            didMountRef.current = true;
            DeviceEventEmitter.emit('credentialsReadyForAuth');
        }
    }, [loadData]);

    // Search term request
    useEffect(() => {
        const subscription = searchTermRef.current
            .pipe(skip(1), debounceTime(500))
            .subscribe(searchTerm => {
                console.info('Debounce search term: ', searchTerm);
                loadData(false, searchTerm);
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [loadData]);

    // Refresh when app from background to foreground
    useEffect(() => {
        const subscription = AppManager.appFromBackgroundToForeground.subscribe(
            () => {
                loadData(true, searchTermRef.current.value);
            },
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [loadData]);

    useEffect(() => {
        const subscription = ChatManager.shared.messageSentEvent.subscribe(
            () => {
                needToRefreshData.current = true;
            },
        );

        const focusSubscription = navigation.addListener('focus', () => {
            if (needToRefreshData.current) {
                loadData(true, searchTermRef.current.value);
                needToRefreshData.current = false;
            }
        });

        return () => {
            subscription.unsubscribe();
            focusSubscription();
        };
    }, [navigation, loadData]);

    const renderEmpty = useCallback(() => {
        return (
            <View style={styles.emptyContainer}>
                <TextPrimary style={styles.label}>{t('listEmpty')}</TextPrimary>
            </View>
        );
    }, [t]);

    const renderLoadMore = useCallback(() => {
        if (isLoadMore) {
            return (
                <View style={styles.viewCenter}>
                    <ActivityIndicator animating size={'large'} />
                </View>
            );
        }

        return null;
    }, [isLoadMore]);

    return (
        <View style={styles.container}>
            <HomeHeader
                navigation={navigation}
                onChangeText={onChangeText}
                onFilterChange={onFilterChange}
            />
            {!isLoading ? (
                <Animated.FlatList
                    style={styles.list}
                    contentContainerStyle={styles.contentContainer}
                    data={sortedConversations}
                    refreshing={refreshing}
                    ItemSeparatorComponent={ListSeparator}
                    ListEmptyComponent={renderEmpty}
                    ListFooterComponent={renderLoadMore}
                    renderItem={renderItem}
                    keyExtractor={(item: ChatItemResponse) =>
                        `${item.objectId}-${item.objectInstanceId}`
                    }
                    onRefresh={() => loadData(true)}
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.7}
                    itemLayoutAnimation={LinearTransition.springify()}
                />
            ) : (
                <View style={styles.viewCenter}>
                    <ActivityIndicator animating size={'large'} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorPrimary,
    },
    list: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: theme.spacing.large,
        paddingVertical: theme.spacing.small,
        backgroundColor: theme.color.backgroundColorPrimary,
    },
    lineSeparator: {
        height: 1,
        backgroundColor: theme.color.colorSeparator,
    },
    emptyContainer: {
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.large,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: theme.color.labelColor,
    },
    viewCenter: {
        width: '100%',
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.medium,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
