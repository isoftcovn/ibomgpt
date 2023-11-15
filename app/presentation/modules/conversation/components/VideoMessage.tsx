import { Dimensions } from '@theme/Dimensions';
import { theme } from '@theme/index';
import { IAppChatMessage } from 'app/presentation/models/chat';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { createThumbnail } from 'react-native-create-thumbnail';
import { MessageVideoProps } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';

const VideoMessage = React.memo((props: MessageVideoProps<IAppChatMessage>) => {
    const { currentMessage } = props;
    const [thumbnailUri, setThumbnailUri] = useState<string>();
    const videoUrl = useMemo(() => currentMessage?.video ?? '', [currentMessage]);
    useEffect(() => {
        if (videoUrl.length > 0) {
            createThumbnail({
                url: videoUrl,
                timeStamp: 1000,
            })
                .then(response => {
                    setThumbnailUri(response.path);
                })
                .catch(error => {
                    console.warn('Create thumbnail for video error: ', error);
                });
        }
    }, [videoUrl]);

    if (currentMessage) {
        return <View style={styles.left.videoContainer}>
            <Image
                source={{
                    uri: thumbnailUri
                }}
                resizeMode={'cover'}
                style={styles.left.videoThumbnail}
            />
            <View style={styles.left.playIconContainer}>
                <Ionicons
                    name={'play-circle'}
                    size={Dimensions.moderateScale(36)}
                />
            </View>
        </View>;
    }

    return null;
});

export const MyVideoMessage = (props: MessageVideoProps<IAppChatMessage>) => {
    return <VideoMessage {...props} />;
};

const styles = {
    left: StyleSheet.create({
        videoContainer: {
            marginBottom: theme.spacing.small,
        },
        videoThumbnail: {
            width: Dimensions.moderateScale(140),
            height: Dimensions.moderateScale(140),
            borderRadius: Dimensions.moderateScale(10),
        },
        playIconContainer: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.7
        }
    }),
    right: StyleSheet.create({

    })
};
