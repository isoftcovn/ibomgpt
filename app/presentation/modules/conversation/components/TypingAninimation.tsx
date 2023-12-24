import { TextPrimary } from '@components/index';
import { theme } from '@theme/index';
import { ChatManager } from 'app/presentation/managers/ChatManager';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, { withRepeat, withDelay, withTiming, useSharedValue, useAnimatedStyle, interpolate, Easing } from 'react-native-reanimated';
import { ConversationContext } from '../context/ConversationContext';
import { Dimensions } from '@theme/Dimensions';

interface IProps {
    typingContainerStyle?: StyleProp<ViewStyle>;
    dotStyle?: StyleProp<ViewStyle>;
}

export const TypingAnimation = React.memo((props: IProps) => {
    const { typingContainerStyle, dotStyle } = props;
    const { objectId, objectInstanceId } = useContext(ConversationContext);
    const [typingName, setTypingName] = useState('');
    const currentNames = useRef<string[]>([]);
    const sv1 = useSharedValue(0);
    const sv2 = useSharedValue(0);
    const sv3 = useSharedValue(0);

    useEffect(() => {
        const subscription = ChatManager.shared.userTypingEvent.subscribe(value => {
            const { objectId: receivedObjectId, objectInstanceId: receivedObjectInstanceId } = value;
            const names = [...currentNames.current];
            const isTheSameChannel = receivedObjectId == objectId && receivedObjectInstanceId == objectInstanceId
            if (!isTheSameChannel) {
                return;
            }
            const index = currentNames.current.findIndex(item => item.toLowerCase().trim() === value.userName.toLowerCase().trim());
            const existed = index !== -1;
            if (value.typingState === 'typing') {
                if (!existed && currentNames.current.length < 3) {
                    names.push(value.userName);
                }
                currentNames.current = names;
            } else if (value.typingState === 'ended') {
                if (existed) {
                    names.splice(index, 1);
                }
                currentNames.current = names;
            }
            const display = currentNames.current.length > 0 ? `${currentNames.current.join(', ')} ${currentNames.current.length > 1 ? 'are' : 'is'} typing` : '';
            setTypingName(display);
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [objectId, objectInstanceId]);

    useEffect(() => {
        sv1.value = withRepeat(withTiming(1, {
            duration: 500,
            easing: Easing.quad,
        }), -1, true);

        sv2.value = withDelay(200, withRepeat(withTiming(1, {
            duration: 500,
            easing: Easing.quad,
        }), -1, true));

        sv3.value = withDelay(400, withRepeat(withTiming(1, {
            duration: 500,
            easing: Easing.quad,
        }), -1, true));
    }, [sv1, sv3, sv2]);

    const dot1Style = useAnimatedStyle(() => {
        return {
            transform: [{
                translateY: interpolate(
                    sv1.value,
                    [0, 1],
                    [0, -3]
                )
            }]
        };
    });

    const dot2Style = useAnimatedStyle(() => {
        return {
            transform: [{
                translateY: interpolate(
                    sv2.value,
                    [0, 1],
                    [0, -3]
                )
            }]
        };
    });

    const dot3Style = useAnimatedStyle(() => {
        return {
            transform: [{
                translateY: interpolate(
                    sv3.value,
                    [0, 1],
                    [0, -3]
                )
            }]
        };
    });

    if (typingName && typingName.trim().length > 0) {
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
        }}>
            <View style={styles.container}>
                <View style={[styles.typingContainer, typingContainerStyle]}>
                    <Animated.View style={[styles.dot, { marginRight: theme.spacing.tiny, }, dotStyle, dot1Style]} />
                    <Animated.View style={[styles.dot, { marginRight: theme.spacing.tiny, }, dotStyle, dot2Style]} />
                    <Animated.View style={[styles.dot, dotStyle, dot3Style]} />
                </View>
                <TextPrimary
                    style={styles.username}
                    numberOfLines={1}
                >{typingName}</TextPrimary>
            </View>
        </View>;
    }

    return null;
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.medium,
        marginTop: theme.spacing.large,
        backgroundColor: theme.color.backgroundColorPrimary,
        borderRadius: 10,
        height: 20,
        maxWidth: Dimensions.screenWidth() / 4 * 3,
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.medium,
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: theme.color.labelColor,
    },
    username: {
        ...theme.textVariants.subtitle1,
        color: theme.color.labelColor,
        marginRight: theme.spacing.medium,
        maxWidth: (Dimensions.screenWidth() / 4 * 3) - 52
    },
});
