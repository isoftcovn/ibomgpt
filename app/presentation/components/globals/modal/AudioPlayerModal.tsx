import Slider from '@react-native-community/slider';
import GeneratedImages from 'app/assets/GeneratedImages';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Sound from 'react-native-sound';
import Modal from 'react-native-modal';
import IonIcons from 'react-native-vector-icons/Ionicons';
import DropDownHolder from '@shared/helper/DropdownHolder';
import { TextPrimary } from '@components/index';
import { theme } from '@theme/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IProps {
    audioUrl: string;
    onEnd?: () => void;
    onClose?: () => void;
    onProgress?: (currentTime: number, duration: number) => void;
}

export const AudioPlayerModal = React.memo((props: IProps) => {
    const { audioUrl, onEnd, onClose, onProgress } = props;
    const [isVisible, setIsVisible] = useState(true);
    const [playState, setPlayState] = useState<'playing' | 'paused'>();
    const [playSeconds, setPlaySeconds] = useState(0);
    const [duration, setDuration] = useState(0);
    const sound = useRef<Sound>();
    const timeout = useRef<NodeJS.Timeout>();
    const sliderEditing = useRef(false);
    const didmount = useRef(false);

    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (playSeconds > 0) {
            onProgress?.(playSeconds, duration);
        }
    }, [playSeconds, duration, onProgress]);

    const closeModal = useCallback(() => {
        setIsVisible(false);
        onClose?.();
    }, [onClose, setIsVisible]);

    const onSliderEditStart = useCallback(() => {
        sliderEditing.current = true;
    }, []);

    const onSliderEditEnd = useCallback(() => {
        sliderEditing.current = false;
    }, []);

    const onSliderEditing = useCallback((value: number) => {
        if (sound.current) {
            sound.current?.setCurrentTime(value);
            setPlaySeconds(value);
        }
    }, [setPlaySeconds]);

    const playComplete = useCallback((success: boolean) => {
        if (success) {
            console.info('successfully finished playing');
            onEnd?.();
        } else {
            console.info('playback failed due to audio decoding errors');
            DropDownHolder.showInfoAlert('Audio file error.');
        }
        setPlayState('paused');
        setPlaySeconds(0);
        sound.current?.setCurrentTime(0);
    }, [setPlayState, setPlaySeconds, onEnd]);

    const play = useCallback(async () => {
        if (sound.current) {
            sound.current.play(playComplete);
            setPlayState('playing');
        } else {
            console.info('play audio: ', audioUrl);

            sound.current = new Sound(audioUrl, undefined, (error) => {
                if (error) {
                    console.info('failed to load the sound', error);
                    DropDownHolder.showInfoAlert('Audio file error.');
                    setPlayState('paused');
                } else {
                    setPlayState('playing');
                    setDuration(sound.current?.getDuration() ?? 0);
                    Sound.setCategory('Playback');
                    sound.current?.setSpeakerphoneOn(true);
                    sound.current?.play(playComplete);
                }
            });
        }
    }, [playComplete, audioUrl, setPlayState]);

    const pause = useCallback(() => {
        sound.current?.pause();
        setPlayState('paused');
    }, [setPlayState]);

    const jumpSeconds = useCallback((secsDelta: number) => {
        sound.current?.getCurrentTime((secs, isPlaying) => {
            let nextSecs = secs + secsDelta;
            if (nextSecs < 0) {
                nextSecs = 0;
            } else if (nextSecs > duration) {
                nextSecs = duration;
            }
            sound.current?.setCurrentTime(nextSecs);
            setPlaySeconds(nextSecs);
        });
    }, [duration, setPlaySeconds]);

    const jumpPrev15Seconds = useCallback(() => {
        jumpSeconds(-15);
    }, [jumpSeconds]);

    const jumpNext15Seconds = useCallback(() => {
        jumpSeconds(15);
    }, [jumpSeconds]);

    const getAudioTimeString = useCallback((seconds: number) => {
        const h = Math.floor(seconds / (60 * 60));
        const m = Math.floor(seconds % (60 * 60) / 60);
        const s = Math.floor(seconds % 60);

        return ((h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
    }, []);

    useEffect(() => {
        if (!didmount.current) {
            play();
        }

        if (timeout.current) {
            clearInterval(timeout.current);
        }

        timeout.current = setInterval(() => {
            if (sound.current && sound.current.isLoaded() && playState === 'playing' && !sliderEditing.current) {
                sound.current.getCurrentTime((seconds, isPlaying) => {
                    setPlaySeconds(seconds);
                });
            }
        }, 100);

        if (!didmount.current) {
            didmount.current = true;
        }
    }, [play, setPlaySeconds, playState]);

    useEffect(() => {
        return () => {
            sound.current?.release();

            if (timeout.current) {
                clearInterval(timeout.current);
            }

            onClose?.();
        };
    }, [onClose]);

    const currentTimeString = getAudioTimeString(playSeconds);
    const durationString = getAudioTimeString(duration);

    return <Modal
        backdropOpacity={0.6}
        isVisible={isVisible}
        onBackdropPress={closeModal}
        swipeDirection={'down'}
        onSwipeComplete={closeModal}
        onBackButtonPress={closeModal}
        style={styles.modal}>
        <View style={[styles.container, {
            marginTop: insets.top > 0 ? insets.top : theme.spacing.medium,
            paddingBottom: insets.bottom,
        }]}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <IonIcons name={'close'} size={24} color={'#fff'} />
            </TouchableOpacity>
            <Image source={GeneratedImages.ic_speaker} style={styles.speaker} />
            <View style={styles.controlContainer}>
                <TouchableOpacity onPress={jumpPrev15Seconds} style={{ justifyContent: 'center' }}>
                    <Image source={GeneratedImages.ic_playjumpleft} style={styles.controlImage} />
                    <TextPrimary style={styles.jumpText}>15</TextPrimary>
                </TouchableOpacity>
                {playState === 'playing' &&
                    <TouchableOpacity onPress={pause} style={{ marginHorizontal: 20 }}>
                        <Image source={GeneratedImages.ic_pause} style={styles.controlImage} />
                    </TouchableOpacity>}
                {playState === 'paused' &&
                    <TouchableOpacity onPress={play} style={{ marginHorizontal: 20 }}>
                        <Image source={GeneratedImages.ic_play} style={styles.controlImage} />
                    </TouchableOpacity>}
                <TouchableOpacity onPress={jumpNext15Seconds} style={{ justifyContent: 'center' }}>
                    <Image source={GeneratedImages.ic_playjumpright} style={styles.controlImage} />
                    <TextPrimary style={styles.jumpText}>15</TextPrimary>
                </TouchableOpacity>
            </View>
            <View style={styles.sliderContainer}>
                <TextPrimary style={{ color: 'white', alignSelf: 'center' }}>{currentTimeString}</TextPrimary>
                <Slider
                    onTouchStart={onSliderEditStart}
                    onTouchEnd={onSliderEditEnd}
                    onValueChange={onSliderEditing}
                    value={playSeconds}
                    maximumValue={duration}
                    maximumTrackTintColor="gray"
                    minimumTrackTintColor="white"
                    thumbTintColor="white"
                    style={{ flex: 1, alignSelf: 'center', marginHorizontal: Platform.select({ ios: 5 }) }}
                />
                <TextPrimary style={{ color: 'white', alignSelf: 'center' }}>{durationString}</TextPrimary>
            </View>
        </View>
    </Modal>;
});

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        padding: 0,
        backgroundColor: '#000'
    },
    container: { flex: 1, justifyContent: 'center', },
    speaker: { width: 150, height: 150, marginBottom: 15, alignSelf: 'center' },
    controlContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15 },
    controlImage: { width: 30, height: 30 },
    jumpText: { position: 'absolute', alignSelf: 'center', marginTop: 1, ...theme.textVariants.body2, color: 'white', fontWeight: '400', },
    sliderContainer: { marginVertical: 15, marginHorizontal: 15, flexDirection: 'row' },
    closeButton: {
        position: 'absolute',
        left: theme.spacing.large,
        top: 0,
        padding: theme.spacing.medium
    },
    closeIcon: {
        width: 20,
        height: 20,
        tintColor: '#fff'
    }
});
