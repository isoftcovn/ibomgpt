import { Dimensions } from '@theme/Dimensions';
import { IAppChatMessage } from 'app/presentation/models/chat';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { MessageImageProps } from 'react-native-gifted-chat';
import ImageView from 'react-native-image-viewing';

const ImageMessage = React.memo((props: MessageImageProps<IAppChatMessage>) => {
    const { imageProps, currentMessage, } = props;
    const [visible, setIsVisible] = useState(false);
    const imageUrl = useMemo(() => currentMessage?.image, [currentMessage]);
    return <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsVisible(true)}
    >
        <FastImage
            {...imageProps}
            style={[styles.image]}
            source={{ uri: imageUrl }}
            resizeMode={'cover'}
        />
        {visible && imageUrl ? <ImageView
            images={[{
                uri: imageUrl,
            }]}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
            onLongPress={(image) => {
                console.log('onLongPress: ', image);
            }}
        /> : null}
    </TouchableOpacity>;
});

export const RenderImageMessage = (props: MessageImageProps<IAppChatMessage>) => {
    return <ImageMessage {...props} />;
};

const styles = StyleSheet.create({
    image: {
        width: Dimensions.moderateScale(150),
        aspectRatio: 1.5,
        borderRadius: 10,
        margin: 3,
        alignSelf: 'center',
    },
});
