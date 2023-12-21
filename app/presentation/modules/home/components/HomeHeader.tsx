import { Box } from '@components/globals/view/Box';
import { Dimensions } from '@theme/Dimensions';
import { theme } from '@theme/index';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IProps {
    onChangeText: (text: string) => void;
}

export const HomeHeader = React.memo((props: IProps) => {
    const { onChangeText } = props;
    const inputRef = useRef<TextInput>();

    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    return <View
        style={[styles.container, {
            height: 45 + insets.top,
            paddingTop: insets.top,
        }]}
    >
        <Box style={styles.contentContainer}>
            <View style={styles.searchContainer}>
                <TouchableOpacity
                    onPress={() => {
                        inputRef.current?.focus();
                    }}
                >
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color={theme.color.onBackground}
                    />
                </TouchableOpacity>
                <TextInput
                    ref={(ref: any) => inputRef.current = ref}
                    style={styles.searchInput}
                    underlineColorAndroid={'transparent'}
                    placeholder={t('searchConversation') ?? ''}
                    placeholderTextColor={theme.color.labelColor}
                    returnKeyType="search"
                    onChangeText={onChangeText}
                />
            </View>
        </Box>
    </View>;
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.color.navigationBackgroundColor,
        paddingHorizontal: theme.spacing.huge,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    searchContainer: {
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
    }
});
