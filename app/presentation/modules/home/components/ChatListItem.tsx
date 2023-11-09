import { Box } from '@components/globals/view/Box';
import { TextPrimary } from '@components/index';
import { ChatItemResponse } from '@models/chat/response/ChatItemResponse';
import { Dimensions } from '@theme/Dimensions';
import { theme } from '@theme/index';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';

interface IProps {
    data: ChatItemResponse;
    onPress: (data: ChatItemResponse) => void;
}

export const ChatListItem = React.memo((props: IProps) => {
    const { data, onPress } = props;
    const { t } = useTranslation();

    const _onPress = useCallback(() => {
        onPress(data);
    }, [onPress, data]);

    const name = useMemo(() => {
        return data.name.length > 0 ? data.name : t('emptyConversationName');
    }, [t, data.name]);

    const avatarTitle = useMemo(() => {
        return name.charAt(0).toUpperCase();
    }, [name]);

    const lastCommentSentDate = useMemo(() => {
        let text = (data.lastCommentUpdatedDateDisplay || data.lastCommentCreatedDateDisplay) ?? '';
        return text.trim().split(' ').filter(value => value.trim().length > 0).join(' ');
    }, [data.lastCommentCreatedDateDisplay, data.lastCommentUpdatedDateDisplay]);

    const lastComment = useMemo(() => {
        const lastCommentContent = data.lastCommentContent ?? '';
        const lastSenderName = data.lastSenderName ?? '';
        return `${lastSenderName}: ${lastCommentContent}`;
    }, [data.lastCommentContent, data.lastSenderName]);

    return <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={_onPress}
    >
        <Avatar
            rounded
            source={{
                uri: data.avatar,
            }}
            activeOpacity={1}
            size={Dimensions.moderateScale(32)}
            title={avatarTitle}
        />
        <Box
            style={styles.contentBox}
        >
            <Box direction={'row'}>
                <TextPrimary
                    style={styles.name}
                    numberOfLines={2}
                >{name}</TextPrimary>
                <TextPrimary
                    style={styles.lastCommentSentDate}
                    numberOfLines={2}
                >{lastCommentSentDate}</TextPrimary>
            </Box>
            <TextPrimary
                style={styles.lastComment}
                numberOfLines={2}
            >{lastComment}</TextPrimary>
        </Box>
    </TouchableOpacity>;
});

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.medium,
        backgroundColor: theme.color.backgroundColorPrimary,
        flexDirection: 'row',
    },
    avatar: {
        width: Dimensions.moderateScale(32),
        height: Dimensions.moderateScale(32),
        borderRadius: Dimensions.moderateScale(16),
    },
    name: {
        ...theme.textVariants.body1,
        fontWeight: '500',
        flex: 1,
    },
    lastComment: {
        ...theme.textVariants.body2,
        marginTop: theme.spacing.small,
    },
    lastCommentSentDate: {
        ...theme.textVariants.body3,
        marginLeft: theme.spacing.small,
        marginTop: 3
    },
    contentBox: {
        flex: 1,
        marginLeft: theme.spacing.medium,
    }
});
