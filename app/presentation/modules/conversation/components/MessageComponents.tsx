import {Dimensions} from '@theme/Dimensions';
import {theme} from '@theme/index';
import {IAppChatMessage} from 'app/presentation/models/chat';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
    Avatar,
    AvatarProps,
    Bubble,
    BubbleProps,
    Day,
    DayProps,
    Message,
    MessageProps,
    MessageText,
    MessageTextProps,
    SystemMessage,
    SystemMessageProps,
    Time,
    TimeProps,
    User,
} from 'react-native-gifted-chat';
import {FileMessage} from './FileMessage';
import {TextPrimary} from '@components/index';
import {MyMessage} from './Message';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const MyAvatar = (props: AvatarProps<IAppChatMessage>) => {
    return (
        <Avatar
            {...props}
            containerStyle={{
                left: styles.left.avatarContainer,
                right: styles.right.avatarContainer,
            }}
        />
    );
};

export const TimeText = (props: TimeProps<IAppChatMessage>) => {
    return (
        <Time
            {...props}
            timeFormat={'hh:mmA'}
            timeTextStyle={{
                left: styles.left.timeText,
                right: styles.right.timeText,
            }}
        />
    );
};

export const UserNameText = (user: User) => {
    return (
        <TextPrimary style={styles.left.username}>
            {user.name ?? ''}
        </TextPrimary>
    );
};

export const MyBubble = (props: BubbleProps<IAppChatMessage>) => (
    <Bubble
        {...props}
        renderTime={TimeText}
        renderUsernameOnMessage={false}
        containerToNextStyle={{
            right: styles.right.containerToNext,
            left: styles.left.containerToNext,
        }}
        containerToPreviousStyle={{
            right: styles.right.containerToPrevious,
            left: styles.left.containerToPrevious,
        }}
        wrapperStyle={{
            left: styles.left.bubbleContainer,
            right: styles.right.bubbleContainer,
        }}
        textStyle={{
            left: styles.left.textMessage,
            right: styles.right.textMessage,
        }}
    />
);

export const RenderMessage = (props: MessageProps<IAppChatMessage>) => (
    <MyMessage
        {...props}
        containerStyle={{
            left: styles.left.messageContainer,
            right: styles.right.messageContainer,
        }}
    />
);

export const MyTextMessage = (props: MessageTextProps<IAppChatMessage>) => (
    <MessageText
        {...props}
        linkStyle={{
            left: styles.left.link,
            right: styles.right.link,
        }}
    />
);

export const MySystemMessage = (props: SystemMessageProps<IAppChatMessage>) => {
    return <SystemMessage
        {...props}
        textStyle={styles.left.systemMessage}
    />;
};

export const MyDayMessage = (props: DayProps<IAppChatMessage>) => {
    return <Day
        {...props}
        textStyle={styles.left.systemMessage}
        dateFormat={'DD/MM/YYYY'}
    />;
};

export const MyCustomMessage = (props: BubbleProps<IAppChatMessage>) => {
    const {currentMessage} = props;
    if ((currentMessage?.fileUrl ?? '').length > 0) {
        return <FileMessage {...props} />;
    }
    return null;
};

export const renderScrollToBottom = () => {
    return (
        <Ionicons
            name={'chevron-down-outline'}
            size={Dimensions.moderateScale(24)}
            color={theme.color.textColor}
        />
    );
};

const styles = {
    left: StyleSheet.create({
        avatarContainer: {
            marginRight: 0,
            paddingRight: 0,
        },
        avatar: {},
        bubbleContainer: {
            borderWidth: 1,
            borderColor: theme.color.colorPrimary,
            borderRadius: 5,
            backgroundColor: '#ffffff',
        },
        timeText: {
            ...theme.textVariants.body3,
            color: theme.color.labelColor,
        },
        textMessage: {
            ...theme.textVariants.body1,
            color: theme.color.textColor,
            fontWeight: '400',
        },
        link: {
            ...theme.textVariants.body1,
            color: '#0000EE',
            fontWeight: '400',
        },
        containerToNext: {
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
        },
        containerToPrevious: {
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
        },
        messageContainer: {
            marginBottom: theme.spacing.tiny,
        },
        systemMessageContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 5,
        },
        systemMessage: {
            ...theme.textVariants.label1,
            color: theme.color.labelColor,
        },
        fileNameMessage: {
            maxWidth: (Dimensions.screenWidth() / 3) * 2,
            ...theme.textVariants.body1,
            color: theme.color.textColor,
            fontWeight: '400',
        },
        fileContainer: {
            padding: theme.spacing.small,
            flexDirection: 'row',
            alignItems: 'center',
        },
        username: {
            ...theme.textVariants.label1,
            color: theme.color.labelColor,
        },
    }),
    right: StyleSheet.create({
        avatarContainer: {
            marginLeft: 0,
            paddingLeft: 0,
        },
        avatar: {},
        bubbleContainer: {
            borderWidth: 1,
            borderColor: '#b9cdd8',
            borderRadius: 10,
            backgroundColor: '#d0f0fd',
        },
        timeText: {
            ...theme.textVariants.body3,
            color: theme.color.labelColor,
        },
        textMessage: {
            ...theme.textVariants.body1,
            color: theme.color.textColor,
            fontWeight: '400',
        },
        link: {
            ...theme.textVariants.body1,
            color: '#0000EE',
            fontWeight: '400',
        },
        containerToNext: {
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
        },
        containerToPrevious: {
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
        },
        messageContainer: {
            marginBottom: theme.spacing.tiny,
        },
    }),
};
