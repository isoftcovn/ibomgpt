import { Box } from '@components/globals/view/Box';
import { theme } from '@theme/index';
import { IAppChatMessage } from 'app/presentation/models/chat';
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Avatar, AvatarProps, Bubble, BubbleProps, Message, MessageProps, MessageText, MessageTextProps, Time, TimeProps,
    SystemMessage, SystemMessageProps
} from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from '@theme/Dimensions';
import { TextPrimary } from '@components/index';
import { FileHelper, FileType } from '@shared/helper/FileHelper';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useOnMessagePressed } from '../hooks/MediaHooks';

export const MyAvatar = (props: AvatarProps<IAppChatMessage>) => {
    return <Avatar
        {...props}
        containerStyle={{
            left: styles.left.avatarContainer,
            right: styles.right.avatarContainer
        }}
    />;
};

export const TimeText = (props: TimeProps<IAppChatMessage>) => {
    return <Time
        {...props}
        timeTextStyle={{
            left: styles.left.timeText,
            right: styles.right.timeText,
        }}
    />;
};

export const MyBubble = (props: BubbleProps<IAppChatMessage>) => (
    <Bubble
        {...props}
        renderTime={TimeText}
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

export const MyMessage = (props: MessageProps<IAppChatMessage>) => (
    <Message
        {...props}
        containerStyle={{
            left: styles.left.messageContainer,
            right: styles.right.messageContainer,
        }}
    // renderDay={() => <Text>Date</Text>}
    />
);

export const MyTextMessage = (props: MessageTextProps<IAppChatMessage>) => (
    <MessageText
        {...props}
    />
);

export const MySystemMessage = (props: SystemMessageProps<IAppChatMessage>) => {
    return <SystemMessage
        {...props}
        textStyle={styles.left.systemMessage}
    />;
};

export const FileMessage = React.memo((props: BubbleProps<IAppChatMessage>) => {
    const { currentMessage } = props;
    const [downloaded, setDownloaded] = useState(false);
    const [isSupportedOpenFile, setIsSupportedOpenFile] = useState(true);

    const checkFileExists = useCallback((fileName: string) => {
        const filePath = FileHelper.shared.getFilePath(fileName);
        ReactNativeBlobUtil.fs.exists(filePath).then(existed => {
            console.log('filePath: ', filePath, existed);
            if (existed) {
                setDownloaded(true);
            }
        }).catch(error => {
            console.log('Check file exists error: ', error);
        });
    }, []);

    useEffect(() => {
        const fileUrl = currentMessage?.fileUrl ?? '';
        const fileType = currentMessage?.fileType;
        const fileName = fileUrl.split('/').pop() ?? '';
        const _isSupportedOpenFile = fileType !== FileType.others;
        checkFileExists(fileName);
        setIsSupportedOpenFile(_isSupportedOpenFile);
    }, [currentMessage, checkFileExists]);

    if (currentMessage) {
        const fileUrl = currentMessage.fileUrl ?? '';
        const fileName = fileUrl.split('/').pop() ?? '';
        return <View
            style={styles.left.fileContainer}
        >
            <Ionicons
                name={'document-outline'}
                size={Dimensions.moderateScale(16)}
                color={theme.color.textColor}
            />
            <Box marginLeft={theme.spacing.small} />
            <TextPrimary
                style={styles.left.fileNameMessage}
                numberOfLines={1}
            >{fileName}</TextPrimary>
            {!isSupportedOpenFile && <>
                <Box marginLeft={theme.spacing.small} />
                <Ionicons
                    name={downloaded ? 'checkmark-circle-outline' : 'cloud-download-outline'}
                    size={Dimensions.moderateScale(18)}
                    color={downloaded ? theme.color.success : theme.color.textColor}
                />
            </>}
        </View>;
    }

    return null;
});

export const MyCustomMessage = (props: BubbleProps<IAppChatMessage>) => {
    const { currentMessage } = props;
    if ((currentMessage?.fileUrl ?? '').length > 0) {
        return <FileMessage {...props} />;
    }
    return null;
};

const styles = {
    left: StyleSheet.create({
        avatarContainer: {
            marginRight: 0,
            paddingRight: 0
        },
        avatar: {
        },
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
        containerToNext: {
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
        },
        containerToPrevious: {
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
        },
        messageContainer: {
            marginBottom: theme.spacing.tiny,
        },
        systemMessage: {
            ...theme.textVariants.label1,
            color: theme.color.labelColor,
        },
        fileNameMessage: {
            maxWidth: Dimensions.screenWidth() / 2 * 3,
            ...theme.textVariants.body1,
            color: theme.color.textColor,
            fontWeight: '400',
        },
        fileContainer: {
            padding: theme.spacing.small,
            flexDirection: 'row',
            alignItems: 'center'
        },
    }),
    right: StyleSheet.create({
        avatarContainer: {
            marginLeft: 0,
            paddingLeft: 0
        },
        avatar: {
        },
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
    })
};
