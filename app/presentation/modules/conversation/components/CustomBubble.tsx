import PropTypes from 'prop-types';
import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    StyleProp,
    ViewStyle,
    TextStyle,
    GestureResponderEvent,
    TouchableOpacity,
} from 'react-native';
import {
    IMessage,
    LeftRightStyle,
    MessageAudioProps,
    MessageImage,
    MessageImageProps,
    MessageText,
    MessageTextProps,
    MessageVideoProps,
    QuickRepliesProps,
    Reply,
    StylePropType,
    Time,
    TimeProps,
    User,
    isSameDay,
    isSameUser,
} from 'react-native-gifted-chat';
import {GiftedChatContext} from 'react-native-gifted-chat/lib/GiftedChatContext';
import {QuickReplies} from 'react-native-gifted-chat/lib/QuickReplies';
import Color from '../helper/ChatColor';
import {IAppChatMessage} from 'app/presentation/models/chat';
import {MeasureOnSuccessCallback} from './CustomBubble.model';
import MessageReactionsView from './MessageReactionsView';

const styles = {
    left: StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'flex-start',
        },
        wrapper: {
            borderRadius: 15,
            backgroundColor: Color.leftBubbleBackground,
            marginRight: 60,
            minHeight: 20,
            justifyContent: 'flex-end',
        },
        containerToNext: {
            borderBottomLeftRadius: 3,
        },
        containerToPrevious: {
            borderTopLeftRadius: 3,
        },
        bottom: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
        },
    }),
    right: StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'flex-end',
        },
        wrapper: {
            borderRadius: 15,
            backgroundColor: Color.defaultBlue,
            marginLeft: 60,
            minHeight: 20,
            justifyContent: 'flex-end',
        },
        containerToNext: {
            borderBottomRightRadius: 3,
        },
        containerToPrevious: {
            borderTopRightRadius: 3,
        },
        bottom: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
    }),
    content: StyleSheet.create({
        tick: {
            fontSize: 10,
            backgroundColor: Color.backgroundTransparent,
            color: Color.white,
        },
        tickView: {
            flexDirection: 'row',
            marginRight: 10,
        },
        username: {
            top: -3,
            left: 0,
            fontSize: 12,
            backgroundColor: 'transparent',
            color: '#aaa',
        },
        usernameView: {
            flexDirection: 'row',
            marginHorizontal: 10,
        },
    }),
};

export type RenderMessageImageProps<TMessage extends IMessage> = Omit<
    BubbleProps<TMessage>,
    'containerStyle' | 'wrapperStyle'
> &
    MessageImageProps<TMessage>;

export type RenderMessageVideoProps<TMessage extends IMessage> = Omit<
    BubbleProps<TMessage>,
    'containerStyle' | 'wrapperStyle'
> &
    MessageVideoProps<TMessage>;

export type RenderMessageAudioProps<TMessage extends IMessage> = Omit<
    BubbleProps<TMessage>,
    'containerStyle' | 'wrapperStyle'
> &
    MessageAudioProps<TMessage>;

export type RenderMessageTextProps<TMessage extends IMessage> = Omit<
    BubbleProps<TMessage>,
    'containerStyle' | 'wrapperStyle'
> &
    MessageTextProps<TMessage>;

export interface BubbleProps<TMessage extends IMessage> {
    user?: User;
    touchableProps?: object;
    renderUsernameOnMessage?: boolean;
    isCustomViewBottom?: boolean;
    inverted?: boolean;
    position: 'left' | 'right';
    currentMessage: TMessage;
    nextMessage?: TMessage;
    previousMessage?: TMessage;
    optionTitles?: string[];
    containerStyle?: LeftRightStyle<ViewStyle>;
    wrapperStyle?: LeftRightStyle<ViewStyle>;
    textStyle?: LeftRightStyle<TextStyle>;
    bottomContainerStyle?: LeftRightStyle<ViewStyle>;
    tickStyle?: StyleProp<TextStyle>;
    containerToNextStyle?: LeftRightStyle<ViewStyle>;
    containerToPreviousStyle?: LeftRightStyle<ViewStyle>;
    usernameStyle?: TextStyle;
    quickReplyStyle?: StyleProp<ViewStyle>;
    quickReplyTextStyle?: StyleProp<TextStyle>;
    quickReplyContainerStyle?: StyleProp<ViewStyle>;
    onPress?(
        context?: unknown,
        message?: unknown,
        evt?: GestureResponderEvent,
        viewMeasured?: MeasureOnSuccessCallback,
    ): void;
    onLongPress?(
        context?: unknown,
        message?: unknown,
        evt?: GestureResponderEvent,
        viewMeasured?: MeasureOnSuccessCallback,
    ): void;
    onReactionsPress?(message?: TMessage): void;
    onQuickReply?(replies: Reply[]): void;
    renderMessageImage?(
        props: RenderMessageImageProps<TMessage>,
    ): React.ReactNode;
    renderMessageVideo?(
        props: RenderMessageVideoProps<TMessage>,
    ): React.ReactNode;
    renderMessageAudio?(
        props: RenderMessageAudioProps<TMessage>,
    ): React.ReactNode;
    renderMessageText?(
        props: RenderMessageTextProps<TMessage>,
    ): React.ReactNode;
    renderCustomView?(bubbleProps: BubbleProps<TMessage>): React.ReactNode;
    renderTime?(timeProps: TimeProps<TMessage>): React.ReactNode;
    renderTicks?(currentMessage: TMessage): React.ReactNode;
    renderUsername?(user?: TMessage['user']): React.ReactNode;
    renderQuickReplySend?(): React.ReactNode;
    renderQuickReplies?(
        quickReplies: QuickRepliesProps<TMessage>,
    ): React.ReactNode;
}

export default class CustomBubble<
    TMessage extends IMessage = IAppChatMessage,
> extends React.PureComponent<BubbleProps<TMessage>> {
    static contextType = GiftedChatContext;

    static defaultProps = {
        touchableProps: {},
        onPress: null,
        onLongPress: null,
        renderMessageImage: null,
        renderMessageVideo: null,
        renderMessageAudio: null,
        renderMessageText: null,
        renderCustomView: null,
        renderUsername: null,
        renderTicks: null,
        renderTime: null,
        renderQuickReplies: null,
        onQuickReply: null,
        position: 'left',
        currentMessage: {
            text: null,
            createdAt: null,
            image: null,
        },
        nextMessage: {},
        previousMessage: {},
        containerStyle: {},
        wrapperStyle: {},
        bottomContainerStyle: {},
        tickStyle: {},
        usernameStyle: {},
        containerToNextStyle: {},
        containerToPreviousStyle: {},
    };

    static propTypes = {
        user: PropTypes.object.isRequired,
        touchableProps: PropTypes.object,
        onLongPress: PropTypes.func,
        renderMessageImage: PropTypes.func,
        renderMessageVideo: PropTypes.func,
        renderMessageAudio: PropTypes.func,
        renderMessageText: PropTypes.func,
        renderCustomView: PropTypes.func,
        isCustomViewBottom: PropTypes.bool,
        renderUsernameOnMessage: PropTypes.bool,
        renderUsername: PropTypes.func,
        renderTime: PropTypes.func,
        renderTicks: PropTypes.func,
        renderQuickReplies: PropTypes.func,
        onQuickReply: PropTypes.func,
        position: PropTypes.oneOf(['left', 'right']),
        optionTitles: PropTypes.arrayOf(PropTypes.string),
        currentMessage: PropTypes.object,
        nextMessage: PropTypes.object,
        previousMessage: PropTypes.object,
        containerStyle: PropTypes.shape({
            left: StylePropType,
            right: StylePropType,
        }),
        wrapperStyle: PropTypes.shape({
            left: StylePropType,
            right: StylePropType,
        }),
        bottomContainerStyle: PropTypes.shape({
            left: StylePropType,
            right: StylePropType,
        }),
        tickStyle: StylePropType,
        usernameStyle: StylePropType,
        containerToNextStyle: PropTypes.shape({
            left: StylePropType,
            right: StylePropType,
        }),
        containerToPreviousStyle: PropTypes.shape({
            left: StylePropType,
            right: StylePropType,
        }),
    };

    containerTouchable?: TouchableOpacity | null;

    onPress = (evt: GestureResponderEvent) => {
        const {onPress} = this.props;
        if (onPress) {
            this.containerTouchable?.measure(
                (x, y, width, height, pageX, pageY) => {
                    onPress(this.context, this.props.currentMessage, evt, {
                        x,
                        y,
                        width,
                        height,
                        pageX,
                        pageY,
                    });
                },
            );
        }
    };

    onLongPress = (evt: GestureResponderEvent) => {
        const {currentMessage, onLongPress, optionTitles} = this.props;
        this.containerTouchable?.measure(
            (x, y, width, height, pageX, pageY) => {
                if (onLongPress) {
                    onLongPress(this.context, currentMessage, evt, {
                        x,
                        y,
                        width,
                        height,
                        pageX,
                        pageY,
                    });
                    return;
                }
            },
        );
    };

    styledBubbleToNext() {
        const {currentMessage, nextMessage, position, containerToNextStyle} =
            this.props;
        if (
            currentMessage &&
            nextMessage &&
            position &&
            isSameUser(currentMessage, nextMessage) &&
            isSameDay(currentMessage, nextMessage)
        ) {
            return [
                styles[position].containerToNext,
                containerToNextStyle?.[position],
            ];
        }

        return null;
    }

    styledBubbleToPrevious() {
        const {
            currentMessage,
            previousMessage,
            position,
            containerToPreviousStyle,
        } = this.props;
        if (
            currentMessage &&
            previousMessage &&
            position &&
            isSameUser(currentMessage, previousMessage) &&
            isSameDay(currentMessage, previousMessage)
        ) {
            return [
                styles[position].containerToPrevious,
                containerToPreviousStyle && containerToPreviousStyle[position],
            ];
        }

        return null;
    }

    renderQuickReplies() {
        const {
            currentMessage,
            onQuickReply,
            nextMessage,
            renderQuickReplySend,
            quickReplyStyle,
            quickReplyTextStyle,
            quickReplyContainerStyle,
        } = this.props;
        if (currentMessage && currentMessage.quickReplies) {
            const {
                /* eslint-disable @typescript-eslint/no-unused-vars */
                containerStyle,
                wrapperStyle,
                /* eslint-enable @typescript-eslint/no-unused-vars */
                ...quickReplyProps
            } = this.props;

            if (this.props.renderQuickReplies) {
                return this.props.renderQuickReplies(quickReplyProps);
            }

            return (
                <QuickReplies
                    currentMessage={currentMessage}
                    onQuickReply={onQuickReply}
                    renderQuickReplySend={renderQuickReplySend}
                    quickReplyStyle={quickReplyStyle}
                    quickReplyTextStyle={quickReplyTextStyle}
                    quickReplyContainerStyle={quickReplyContainerStyle}
                    nextMessage={nextMessage}
                />
            );
        }
        return null;
    }

    renderMessageText() {
        if (this.props.currentMessage && this.props.currentMessage.text) {
            const {
                /* eslint-disable @typescript-eslint/no-unused-vars */
                containerStyle,
                wrapperStyle,
                optionTitles,
                /* eslint-enable @typescript-eslint/no-unused-vars */
                ...messageTextProps
            } = this.props;
            if (this.props.renderMessageText) {
                return this.props.renderMessageText(messageTextProps);
            }

            return <MessageText {...messageTextProps} />;
        }
        return null;
    }

    renderMessageImage() {
        if (this.props.currentMessage && this.props.currentMessage.image) {
            const {
                /* eslint-disable @typescript-eslint/no-unused-vars */
                containerStyle,
                wrapperStyle,
                /* eslint-enable @typescript-eslint/no-unused-vars */
                ...messageImageProps
            } = this.props;

            if (this.props.renderMessageImage) {
                return this.props.renderMessageImage(messageImageProps);
            }

            return <MessageImage {...messageImageProps} />;
        }
        return null;
    }

    renderMessageVideo() {
        if (!this.props.currentMessage?.video) {
            return null;
        }

        const {
            /* eslint-disable @typescript-eslint/no-unused-vars */
            containerStyle,
            wrapperStyle,
            /* eslint-enable @typescript-eslint/no-unused-vars */
            ...messageVideoProps
        } = this.props;

        if (this.props.renderMessageVideo) {
            return this.props.renderMessageVideo(messageVideoProps);
        }

        return null;
    }

    renderMessageAudio() {
        if (!this.props.currentMessage?.audio) {
            return null;
        }

        const {
            /* eslint-disable @typescript-eslint/no-unused-vars */
            containerStyle,
            wrapperStyle,
            /* eslint-enable @typescript-eslint/no-unused-vars */
            ...messageAudioProps
        } = this.props;

        if (this.props.renderMessageAudio) {
            return this.props.renderMessageAudio(messageAudioProps);
        }

        return null;
    }

    renderTicks() {
        const {currentMessage, renderTicks, user} = this.props;
        if (renderTicks && currentMessage) {
            return renderTicks(currentMessage);
        }

        if (
            currentMessage &&
            user &&
            currentMessage.user &&
            currentMessage.user._id !== user._id
        ) {
            return null;
        }

        if (
            currentMessage &&
            (currentMessage.sent ||
                currentMessage.received ||
                currentMessage.pending)
        ) {
            return (
                <View style={styles.content.tickView}>
                    {!!currentMessage.sent && (
                        <Text
                            style={[styles.content.tick, this.props.tickStyle]}>
                            {'✓'}
                        </Text>
                    )}
                    {!!currentMessage.received && (
                        <Text
                            style={[styles.content.tick, this.props.tickStyle]}>
                            {'✓'}
                        </Text>
                    )}
                    {!!currentMessage.pending && (
                        <Text
                            style={[styles.content.tick, this.props.tickStyle]}>
                            {'🕓'}
                        </Text>
                    )}
                </View>
            );
        }

        return null;
    }

    renderTime() {
        if (this.props.currentMessage && this.props.currentMessage.createdAt) {
            const {
                /* eslint-disable @typescript-eslint/no-unused-vars */
                containerStyle,
                wrapperStyle,
                textStyle,
                /* eslint-enable @typescript-eslint/no-unused-vars */
                ...timeProps
            } = this.props;

            if (this.props.renderTime) {
                return this.props.renderTime(timeProps);
            }

            return <Time {...timeProps} />;
        }
        return null;
    }

    renderUsername() {
        const {currentMessage, user, renderUsername} = this.props;
        if (this.props.renderUsernameOnMessage && currentMessage) {
            if (user && currentMessage.user._id === user._id) {
                return null;
            }

            if (renderUsername) {
                return renderUsername(currentMessage.user);
            }

            return (
                <View style={styles.content.usernameView}>
                    <Text
                        style={
                            [
                                styles.content.username,
                                this.props.usernameStyle,
                            ] as TextStyle
                        }>
                        {'~ '}
                        {currentMessage.user.name}
                    </Text>
                </View>
            );
        }
        return null;
    }

    renderCustomView() {
        if (this.props.renderCustomView) {
            return this.props.renderCustomView(this.props);
        }

        return null;
    }

    renderBubbleContent() {
        return this.props.isCustomViewBottom ? (
            <View>
                {this.renderMessageImage()}
                {this.renderMessageVideo()}
                {this.renderMessageAudio()}
                {this.renderMessageText()}
                {this.renderCustomView()}
            </View>
        ) : (
            <View>
                {this.renderCustomView()}
                {this.renderMessageImage()}
                {this.renderMessageVideo()}
                {this.renderMessageAudio()}
                {this.renderMessageText()}
            </View>
        );
    }

    render() {
        const {
            position,
            containerStyle,
            wrapperStyle,
            bottomContainerStyle,
            currentMessage,
            onReactionsPress,
        } = this.props;
        return (
            <View
                style={[
                    styles[position].container,
                    containerStyle && containerStyle[position],
                ]}>
                <View
                    style={[
                        styles[position].wrapper,
                        this.styledBubbleToNext(),
                        this.styledBubbleToPrevious(),
                        wrapperStyle && wrapperStyle[position],
                    ]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.onPress}
                        onLongPress={this.onLongPress}
                        accessibilityRole="text"
                        {...this.props.touchableProps}
                        ref={ref => {
                            this.containerTouchable = ref;
                        }}>
                        <View>
                            {this.renderBubbleContent()}
                            <View
                                style={[
                                    styles[position].bottom,
                                    bottomContainerStyle &&
                                        bottomContainerStyle[position],
                                ]}>
                                {this.renderUsername()}
                                {this.renderTime()}
                                {this.renderTicks()}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <MessageReactionsView
                    currentMessage={
                        currentMessage as unknown as IAppChatMessage
                    }
                    position={position}
                    onPress={() => {
                        onReactionsPress?.(currentMessage);
                    }}
                />
                {this.renderQuickReplies()}
            </View>
        );
    }
}
