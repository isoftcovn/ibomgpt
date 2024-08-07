import {IFieldValues} from '@components/FormGenerator/model';
import {Box} from '@components/globals/view/Box';
import {AllRouteParamList} from '@navigation/RouteParams';
import {StackNavigationProp} from '@react-navigation/stack';
import {theme} from '@theme/index';
import React, {useCallback, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {TextPrimary} from '@components/index';
import LinkingHelper from '@shared/helper/LinkingHelper';
import {Links} from '@shared/constants';

interface IProps {
    navigation: StackNavigationProp<AllRouteParamList, 'HomeScreen'>;
    onFilterChange: (
        values: Record<string, IFieldValues>,
        refAPI: string,
    ) => void;
    onChangeText: (text: string) => void;
}

export const HomeHeader = React.memo((props: IProps) => {
    const {navigation, onChangeText, onFilterChange} = props;
    const inputRef = useRef<TextInput>();

    const insets = useSafeAreaInsets();
    const {t} = useTranslation();

    const onFilterPress = useCallback(() => {
        navigation.navigate('CommonFilter', {
            title: t('searchObject'),
            onSubmit: onFilterChange,
        });
    }, [navigation, t, onFilterChange]);

    const comebackToiBomPro = useCallback(() => {
        LinkingHelper.openIBomProApp();
    }, []);

    return (
        <View
            style={[
                styles.container,
                {
                    height: 45 + insets.top,
                    paddingTop: insets.top,
                },
            ]}>
            <Box style={styles.contentContainer}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: theme.spacing.small,
                    }}
                    activeOpacity={0.7}
                    hitSlop={{
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10,
                    }}
                    onPress={comebackToiBomPro}>
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={theme.color.navigationTintColor}
                    />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            inputRef.current?.focus();
                        }}>
                        <Ionicons
                            name="search-outline"
                            size={20}
                            color={theme.color.onBackground}
                        />
                    </TouchableOpacity>
                    <TextInput
                        ref={(ref: any) => (inputRef.current = ref)}
                        style={styles.searchInput}
                        underlineColorAndroid={'transparent'}
                        placeholder={t('searchConversation') ?? ''}
                        placeholderTextColor={theme.color.labelColor}
                        returnKeyType="search"
                        onChangeText={onChangeText}
                    />
                </View>
                <TouchableOpacity
                    style={{
                        marginLeft: theme.spacing.medium,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: theme.spacing.tiny,
                    }}
                    activeOpacity={0.7}
                    hitSlop={{
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10,
                    }}
                    onPress={onFilterPress}>
                    <Feather
                        name="filter"
                        size={24}
                        color={theme.color.navigationTintColor}
                    />
                    <TextPrimary color="#fff">{t('filter')}</TextPrimary>
                </TouchableOpacity>
            </Box>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.color.navigationBackgroundColor,
        paddingLeft: theme.spacing.small,
        paddingRight: theme.spacing.large,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    searchContainer: {
        flex: 1,
        height: 30,
        borderRadius: 5,
        backgroundColor: theme.color.navigationTintColor,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.small,
    },
    searchInput: {
        marginLeft: theme.spacing.small,
        padding: 0,
        flex: 1,
        ...theme.textVariants.body2,
        color: theme.color.textColor,
    },
});
