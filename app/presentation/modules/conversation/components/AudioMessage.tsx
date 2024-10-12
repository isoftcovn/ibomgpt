import { TextPrimary } from '@components/index';
import { Dimensions } from '@theme/Dimensions';
import { theme } from '@theme/index';
import { IAppChatMessage } from 'app/presentation/models/chat';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MessageAudioProps } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AudioMessage = React.memo((props: MessageAudioProps<IAppChatMessage>) => {
    const { currentMessage, } = props;
    const audioUrl = useMemo(() => currentMessage?.audio ?? '', [currentMessage]);
    const audioNName = useMemo(() => {
        return audioUrl.split('/').pop() ?? '';
    }, [audioUrl]);

    if (currentMessage) {
        return <View style={[styles.left.videoContainer]}>
            <Ionicons
                name={'play-outline'}
                size={Dimensions.moderateScale(24)}
                color={theme.color.textColor}
            />
            <View style={{ marginLeft: theme.spacing.small }} />
            <TextPrimary style={styles.left.textMessage}>{audioNName}</TextPrimary>
        </View>;
    }

    return null;
});

export const MyAudioMessage = (props: MessageAudioProps<IAppChatMessage>) => {
    return <AudioMessage {...props} />;
};

const styles = {
    left: StyleSheet.create({
        videoContainer: {
            paddingHorizontal: theme.spacing.small,
            paddingVertical: theme.spacing.small,
            flexDirection: 'row',
            alignItems: 'center',
        },
        textMessage: {
            ...theme.textVariants.body1,
            color: theme.color.textColor,
            fontWeight: '400',
        },
    }),
    right: StyleSheet.create({

    })
};
