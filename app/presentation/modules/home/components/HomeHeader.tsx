import { IFieldValues } from '@components/FormGenerator/model';
import { Box } from '@components/globals/view/Box';
import { AllRouteParamList } from '@navigation/RouteParams';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '@theme/index';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IProps {
    navigation: StackNavigationProp<AllRouteParamList, 'HomeScreen'>;
    onFilterChange: (values: Record<string, IFieldValues>, refAPI: string) => void;
    onChangeText: (text: string) => void;
}

export const HomeHeader = React.memo((props: IProps) => {
    const {navigation, onChangeText, onFilterChange} = props;
    const inputRef = useRef<TextInput>();

    const insets = useSafeAreaInsets();
    const {t} = useTranslation();

    const onFilterPress = useCallback(() => {
        navigation.navigate('CommonFilter', {
            title: t('filterObject'),
            onSubmit: onFilterChange,
        });
    }, [navigation, t, onFilterChange]);

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
                    style={{marginLeft: theme.spacing.medium}}
                    activeOpacity={0.7}
                    hitSlop={{
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10,
                    }}
                    onPress={onFilterPress}>
                    <Ionicons
                        name="filter"
                        size={24}
                        color={theme.color.navigationTintColor}
                    />
                </TouchableOpacity>
            </Box>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.color.navigationBackgroundColor,
        paddingLeft: theme.spacing.huge,
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
