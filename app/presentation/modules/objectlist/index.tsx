import {MyFlatList, TextPrimary} from '@components/index';
import {ChatRepository} from '@data/repository/chat';
import {ObjectItemResponse} from '@models/chat/response/ObjectItemResponse';
import BaseQueryModel from '@models/general/request/BaseQueryModel';
import {PaginationModel} from '@models/general/response/PaginationModel';
import {AppStackParamList} from '@navigation/RouteParams';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {theme} from '@theme/index';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ObjectListItem} from './components/ObjectListItem';
import {useTranslation} from 'react-i18next';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'ObjectList'>;
    route: RouteProp<AppStackParamList, 'ObjectList'>;
}

export const ObjectList = React.memo((props: IProps) => {
    const {navigation, route} = props;
    const [isLoading, setLoading] = useState(false);
    const [isLoadMore, setLoadMore] = useState(false);
    const [pagination, setPagination] =
        useState<PaginationModel<ObjectItemResponse>>();
    const data = useMemo(() => pagination?.items ?? [], [pagination]);
    const {t} = useTranslation();

    const refreshData = useCallback(() => {
        if (route.params.refAPI) {
            const query = new BaseQueryModel();
            const repo = new ChatRepository();
            setLoading(true);
            const payload: any = {};
            if (route.params.values) {
                Object.keys(route.params.values).forEach(key => {
                    payload[key] = route.params.values[key].value;
                });
            }
            repo.getObjectList(route.params.refAPI!, {
                ...query,
                ...payload,
            })
                .then(response => {
                    setPagination(response);
                })
                .catch(error => {
                    console.warn('fetch object list error: ', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [route]);

    const loadmoreData = useCallback(() => {
        if (
            route.params.refAPI &&
            !isLoadMore &&
            pagination &&
            pagination.totalItemLoaded < pagination.totalItemCount
        ) {
            const query = new BaseQueryModel();
            query.page = (pagination?.page ?? 0) + 1;
            const repo = new ChatRepository();
            setLoadMore(true);
            const payload: any = {};
            if (route.params.values) {
                Object.keys(route.params.values).forEach(key => {
                    payload[key] = route.params.values[key].value;
                });
            }
            repo.getObjectList(route.params.refAPI!, {
                ...query,
                ...payload,
            })
                .then(response => {
                    setPagination(prevState => {
                        return {
                            ...response,
                            items: [
                                ...(prevState?.items ?? []),
                                ...response.items,
                            ],
                        };
                    });
                })
                .catch(error => {
                    console.warn('fetch object list error: ', error);
                })
                .finally(() => {
                    setLoadMore(false);
                });
        }
    }, [route, pagination, isLoadMore]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const renderItem = useCallback(
        ({item, index}: {item: ObjectItemResponse; index: number}) => {
            return (
                <ObjectListItem
                    item={item}
                    onPress={() => {
                        navigation.navigate('Conversation', {
                            objectId: item.objectId,
                            objectInstanceId: item.objectInstanceId,
                        });
                    }}
                />
            );
        },
        [navigation],
    );

    const currentItemNumber = pagination?.totalItemLoaded ?? 0;
    const totalItems = pagination?.totalItemCount ?? 0;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <TextPrimary style={styles.title}>
                    {t('objectList')}
                </TextPrimary>
                <TextPrimary
                    style={
                        styles.numberOfItems
                    }>{`${currentItemNumber}/${totalItems}`}</TextPrimary>
            </View>
            <MyFlatList
                style={styles.container}
                data={data}
                refreshing={isLoading}
                renderItem={renderItem}
                keyExtractor={(item: ObjectItemResponse) =>
                    `${item.objectId}-${item.objectInstanceId}`
                }
                onRefresh={refreshData}
                onEndReached={loadmoreData}
                isLoadMore={isLoadMore}
                onEndReachedThreshold={0.7}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.backgroundColorPrimary,
    },
    titleContainer: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        backgroundColor: theme.color.backgroundColorVariant,
        flexDirection: 'row',
    },
    title: {
        ...theme.textVariants.subtitle1,
        color: '#8C54FF',
        flex: 1,
        marginRight: 8,
    },
    numberOfItems: {
        ...theme.textVariants.subtitle1,
        color: '#8C54FF',
    },
});
