import React from 'react';
// @ts-ignore
import VideoPlayer from 'react-native-video-controls';
import Modal from 'react-native-modal';
import { Dimensions } from '@theme/Dimensions';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@theme/index';

interface IProps {
    visible: boolean;
    videoUri: string;
    onBack: () => void;
}

export const VideoPlayerModal = React.memo((props: IProps) => {
    const { videoUri, visible, onBack } = props;
    const insets = useSafeAreaInsets();
    return <Modal
        isVisible={visible}
        style={styles.modal}
        deviceHeight={Dimensions.screenHeight()}
        deviceWidth={Dimensions.screenWidth()}
        onBackButtonPress={onBack}
        onBackdropPress={onBack}
        onSwipeComplete={onBack}
        swipeDirection={['up', 'down']}
        useNativeDriver
        useNativeDriverForBackdrop
        hideModalContentWhileAnimating
    >
        <VideoPlayer
            source={{ uri: videoUri }}
            style={[styles.videoPlayerContainer, {
                paddingTop: insets.top + theme.spacing.large,
                paddingBottom: insets.bottom + theme.spacing.large,
            }]}
            videoStyle={styles.video}
            disableFullscreen
            onBack={onBack}
        />
    </Modal>;
});

const styles = StyleSheet.create({
    videoPlayerContainer: {
        width: Dimensions.screenWidth(),
        height: Dimensions.screenHeight(),
        margin: 0,
        padding: 0,
        backgroundColor: '#000',
    },
    video: {
        flex: 1,
    },
    modal: {
        margin: 0,
    }
});
