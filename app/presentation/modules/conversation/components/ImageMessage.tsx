import {Dimensions} from '@theme/Dimensions';
import {theme} from '@theme/index';
import {IAppChatMessage} from 'app/presentation/models/chat';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {MessageImageProps} from 'react-native-gifted-chat';
import {useChatContext} from 'react-native-gifted-chat/lib/GiftedChatContext';
import ImageView from 'react-native-image-viewing';

const ImageMessage = React.memo((props: MessageImageProps<IAppChatMessage>) => {
    const {imageProps, currentMessage, onLongPress} = props;
    const [visible, setIsVisible] = useState(false);
    const [imageWidth, setImageWidth] = useState<number>();
    const [imageHeight, setImageHeight] = useState<number>();
    const imageUrl = useMemo(() => currentMessage?.image, [currentMessage]);
    const imageRatio = useMemo(() => {
        if (imageWidth && imageHeight) {
            return imageWidth / imageHeight;
        }

        return undefined;
    }, [imageWidth, imageHeight]);

    console.log('imageRatio: ', imageRatio);

    const context = useChatContext();

    useEffect(() => {
        if (imageUrl) {
            Image.getSize(
                imageUrl,
                (width, height) => {
                    setImageWidth(width);
                    setImageHeight(height);
                },
                error => {
                    console.info('Get image size failed: ', error);
                },
            );
        }
    }, [imageUrl]);

    const renderLoading = useCallback(() => {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    animating
                    size={'large'}
                    color={theme.color.colorPrimary}
                />
            </View>
        );
    }, []);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsVisible(true)}
            onLongPress={() => {
                onLongPress(context, currentMessage);
            }}>
            {imageRatio ? (
                <FastImage
                    {...imageProps}
                    style={[
                        styles.image,
                        {
                            aspectRatio: imageRatio,
                        },
                    ]}
                    source={{uri: imageUrl}}
                    resizeMode={'cover'}
                />
            ) : (
                renderLoading()
            )}
            {visible && imageUrl ? (
                <ImageView
                    images={[
                        {
                            uri: imageUrl,
                        },
                    ]}
                    imageIndex={0}
                    visible={visible}
                    onRequestClose={() => setIsVisible(false)}
                    onLongPress={image => {
                        console.log('onLongPress: ', image);
                    }}
                />
            ) : null}
        </TouchableOpacity>
    );
});

export const RenderImageMessage = (
    props: MessageImageProps<IAppChatMessage>,
) => {
    return <ImageMessage {...props} />;
};

const styles = StyleSheet.create({
    image: {
        width: Dimensions.moderateScale(150),
        borderRadius: 10,
        margin: 3,
        alignSelf: 'center',
    },
    loadingContainer: {
        width: Dimensions.moderateScale(150),
        aspectRatio: 1,
        borderRadius: 10,
        margin: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
