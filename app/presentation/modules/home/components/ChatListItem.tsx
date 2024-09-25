import {Box} from '@components/globals/view/Box';
import {TextPrimary} from '@components/index';
import {ChatItemResponse} from '@models/chat/response/ChatItemResponse';
import UserModel from '@models/user/response/UserModel';
import {selectLatestMessageByKey} from '@redux/selectors/conversation';
import {selectProfile, selectUserId} from '@redux/selectors/user';
import {Dimensions} from '@theme/Dimensions';
import {FontNames} from '@theme/ThemeDefault';
import {theme} from '@theme/index';
import {useLatestMessageContent} from 'app/presentation/hooks/conversation/ConversationCommonHooks';
import dayjs from 'dayjs';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-elements';
import {useSelector} from 'react-redux';

interface IProps {
    data: ChatItemResponse;
    onPress: (data: ChatItemResponse) => void;
}

export const ChatListItem = React.memo((props: IProps) => {
    const {data, onPress} = props;
    const {t} = useTranslation();
    const key = useMemo(
        () => `${data.objectId}-${data.objectInstanceId}`,
        [data],
    );
    const latestMessage = useSelector(state =>
        selectLatestMessageByKey(state, key),
    );
    const latestMessageContent = useLatestMessageContent(latestMessage);
    const profile: UserModel | undefined = useSelector(selectProfile).data;

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
        if (latestMessage) {
            return dayjs(latestMessage.createdAt).format('DD/MM/YYYY hh:mmA');
        }
        let text =
            (data.lastCommentUpdatedDateDisplay ||
                data.lastCommentCreatedDateDisplay) ??
            '';
        return text
            .trim()
            .split(' ')
            .filter(value => value.trim().length > 0)
            .join(' ');
    }, [
        data.lastCommentCreatedDateDisplay,
        data.lastCommentUpdatedDateDisplay,
        latestMessage,
    ]);

    const lastComment = useMemo(() => {
        const displayName = profile?.fullname ?? '';
        let lastCommentContent = data.lastCommentContent ?? '';
        const latestMessageInStoreCreatedDate = latestMessage?.createdAt
            ? dayjs(latestMessage?.createdAt)
            : undefined;
        const latestMessageInListItem = data.lastCommentUpdatedDate;
        let isMessageInStoreNewer = true;
        let isMe = displayName === data.lastSenderName;
        if (
            latestMessageInListItem &&
            latestMessageInStoreCreatedDate &&
            latestMessageInStoreCreatedDate.isBefore(latestMessageInListItem)
        ) {
            isMessageInStoreNewer = false;
        }
        if (latestMessageContent && isMessageInStoreNewer) {
            lastCommentContent = latestMessageContent;
            isMe = latestMessage?.user._id == profile?.id;
        }
        let lastSenderName = data.lastSenderName ?? '';

        if (latestMessage?.user?.name && isMessageInStoreNewer) {
            lastSenderName = latestMessage.user.name;
        }
        return `${isMe ? t('you') : lastSenderName}: ${lastCommentContent}`;
    }, [data, latestMessageContent, latestMessage, profile, t]);

    const isRead = data.isRead;

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.8}
            onPress={_onPress}>
            <TextPrimary style={styles.name} numberOfLines={3}>
                {name}
            </TextPrimary>
            <Box
                direction={'row'}
                style={{
                    gap: theme.spacing.small,
                    alignItems: 'center',
                }}>
                <Avatar
                    rounded
                    source={{
                        uri: data.avatar,
                    }}
                    activeOpacity={1}
                    size={Dimensions.moderateScale(32)}
                    title={avatarTitle}
                />
                <TextPrimary
                    style={[
                        styles.lastComment,
                        !isRead && {
                            fontFamily: FontNames.SemiBold,
                            fontWeight: '700',
                        },
                    ]}
                    numberOfLines={5}>
                    {lastComment}
                </TextPrimary>
            </Box>
            <TextPrimary style={styles.lastCommentSentDate} numberOfLines={2}>
                {lastCommentSentDate}
            </TextPrimary>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.medium,
        backgroundColor: theme.color.backgroundColorPrimary,
        gap: theme.spacing.small,
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
        marginRight: theme.spacing.small,
        flex: 1,
    },
    lastCommentSentDate: {
        ...theme.textVariants.body3,
        textAlign: 'right',
    },
    contentBox: {
        flex: 1,
        marginLeft: theme.spacing.medium,
    },
});
