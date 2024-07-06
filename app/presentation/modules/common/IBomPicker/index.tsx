import {TextPrimary} from '@components/index';
import ApiGateway from '@data/gateway/api';
import {ApiType} from '@data/gateway/api/type';
import {AppStackParamList} from '@navigation/RouteParams';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {theme} from '@theme/index';
import {IPickerItemModel} from 'app/presentation/models/general';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const width = Dimensions.get('window').width;

export interface IBomPickerNavgationParams {
    title: string;
    data: IPickerItemModel[];
    selectedItems: IPickerItemModel[];
    multiple: boolean;
    autofocus?: boolean;
    sourceAPI?: string;
    sourceAPIParams?: FormData;
    onSubmit: (selectedValues: Record<string, IPickerItemModel>) => void;
    onFetchDataSuccess?: (data: IPickerItemModel[]) => void;
}

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'IBomPicker'>;
    route: RouteProp<AppStackParamList, 'IBomPicker'>;
}

export const IBomPicker = (props: IProps) => {
    const {navigation, route} = props;
    const sourceAPI = useRef(route.params.sourceAPI);
    const sourceAPIParams = useRef(route.params.sourceAPIParams);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IPickerItemModel[]>(
        route.params.data ?? [],
    );
    const [filteredData, setFilteredData] = useState<IPickerItemModel[]>([]);
    const [selectedValues, setSelectedValues] = useState<
        Record<string, IPickerItemModel>
    >({});
    const [search, setSearch] = useState('');
    const title = useMemo(() => route.params.title ?? '', [route]);
    const multiple = useMemo(() => route.params.multiple ?? false, [route]);
    const autofocus = useMemo(() => route.params.autofocus ?? true, [route]);
    const onSubmit = useMemo(() => route.params.onSubmit, [route]);

    useEffect(() => {
        const selectedItems = route.params.selectedItems ?? [];
        const selecteds: Record<string, IPickerItemModel> = {};
        selectedItems.forEach(item => {
            selecteds[item.value] = item;
        });
        setSelectedValues(selecteds);
    }, [route]);

    useEffect(() => {
        navigation.setOptions({
            title,
        });
    }, [navigation, title]);

    // Fetch data from remote source
    useEffect(() => {
        if (sourceAPI.current && data.length === 0) {
            const formdata = sourceAPIParams.current ?? new FormData();
            setLoading(true);
            const apiGateway = new ApiGateway({
                method: 'POST',
                resource: {
                    Path: sourceAPI.current,
                    Type: ApiType.Customer,
                },
                body: formdata,
            });
            apiGateway
                .execute()
                .then(response => {
                    const items: any[] = response.items ?? [];
                    const pickerModels: IPickerItemModel[] = items.map(
                        item => ({
                            text: item.text,
                            value: `${item.id}`,
                        }),
                    );
                    setData(pickerModels);
                    const onFetchDataSuccess = route.params.onFetchDataSuccess;
                    onFetchDataSuccess?.(pickerModels);
                })
                .catch(error => {
                    console.warn('Get picker data error: ', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [data, route]);

    const onSubmitPressed = useCallback(() => {
        onSubmit?.(selectedValues);
        navigation.goBack();
    }, [onSubmit, selectedValues, navigation]);

    const handleSearchText = useCallback(
        (searchText: string) => {
            const text = searchText.toLowerCase();
            const _filteredData = data.filter(item => {
                return item.text.toLowerCase().includes(text);
            });

            setSearch(searchText);
            setFilteredData(_filteredData);
        },
        [data],
    );

    const renderSelect = useCallback(
        ({item, index}: {item: IPickerItemModel; index: number}) => {
            const selected = !!selectedValues[item.value] ?? false;
            return (
                <View style={{backgroundColor: '#fff', flex: 1}}>
                    <View style={styles.flatList}>
                        <TouchableOpacity
                            style={styles.flatListItem}
                            activeOpacity={0.8}
                            onPress={() => {
                                if (multiple) {
                                    const newSelected = {...selectedValues};
                                    if (selected) {
                                        delete newSelected[item.value];
                                    } else {
                                        newSelected[item.value] = item;
                                    }
                                    setSelectedValues(newSelected);
                                } else {
                                    setSelectedValues({
                                        [item.value]: item,
                                    });
                                }
                            }}>
                            <TextPrimary
                                style={[
                                    theme.textVariants.body1,
                                    {marginLeft: 5},
                                ]}>
                                {item.text}
                            </TextPrimary>
                        </TouchableOpacity>
                        <MaterialIcons
                            style={{paddingRight: 5}}
                            name="check"
                            size={30}
                            color={selected ? theme.color.colorPrimary : '#fff'}
                        />
                    </View>
                    <View style={styles.bottomLine} />
                </View>
            );
        },
        [multiple, selectedValues],
    );

    const renderSearch = useCallback(() => {
        return (
            <View
                style={[
                    styles.vSearch,
                    {
                        flexDirection: 'row',
                        backgroundColor: '#DDD',
                        alignItems: 'center',
                        borderRadius: 30,
                        marginHorizontal: 15,
                    },
                ]}>
                <TextInput
                    style={styles.search}
                    placeholder={'Tìm kiếm'}
                    value={search}
                    autoFocus={autofocus}
                    onChangeText={handleSearchText}
                />
            </View>
        );
    }, [handleSearchText, search, autofocus]);

    const renderLoading = useCallback(() => {
        return (
            <View style={{padding: theme.spacing.huge}}>
                <ActivityIndicator animating size={'large'} hidesWhenStopped />
            </View>
        );
    }, []);

    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            {loading ? (
                renderLoading()
            ) : (
                <>
                    {renderSearch()}
                    <FlatList
                        keyboardShouldPersistTaps={'handled'}
                        data={search !== '' ? filteredData : data}
                        extraData={selectedValues}
                        renderItem={renderSelect}
                        keyExtractor={(item, index) => item.value}
                    />
                    <TouchableOpacity
                        onPress={onSubmitPressed}
                        style={[
                            styles.btnConfirm,
                            {
                                backgroundColor: theme.color.colorPrimary,
                            },
                        ]}>
                        <TextPrimary
                            style={[
                                theme.textVariants.title1,
                                {
                                    color: '#fff',
                                    fontSize: theme.fontSize.fontSizeMedium,
                                },
                            ]}>
                            {'Xác nhận'}
                        </TextPrimary>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    flatList: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    flatListItem: {
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 15,
        flex: 1,
    },
    bottomLine: {
        height: 1,
        backgroundColor: theme.color.colorSeparator,
        width: width * 0.95,
        alignSelf: 'center',
    },
    btnConfirm: {
        borderRadius: 10,
        height: width / 9,
        marginVertical: 0.05 * width,
        width: width * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    vSearch: {
        marginVertical: 10,
        backgroundColor: 'white',
        paddingLeft: 20,
    },
    search: {
        backgroundColor: '#DDD',
        height: 40,
        paddingRight: Platform.OS == 'ios' ? 10 : 20,
        width: '92%',
    },
});
