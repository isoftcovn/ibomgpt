import {TextPrimary} from '@components/index';
import {theme} from '@theme/index';
import PropTypes from 'prop-types';
import React from 'react';
import {LayoutChangeEvent, StyleSheet, View, ViewStyle} from 'react-native';

import {
    Avatar,
    AvatarProps,
    Bubble,
    Day,
    DayProps,
    IMessage,
    LeftRightStyle,
    StylePropType,
    SystemMessage,
    SystemMessageProps,
    User,
    isSameDay,
    isSameUser,
} from 'react-native-gifted-chat';
import CustomBubble from './CustomBubble';
import {IAppChatMessage} from 'app/presentation/models/chat';

const styles = {
    left: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            marginLeft: 8,
            marginRight: 0,
        },
    }),
    right: StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            marginLeft: 0,
            marginRight: 8,
        },
    }),
    content: StyleSheet.create({
        username: {
            top: -3,
            left: 0,
            ...theme.textVariants.body2,
            backgroundColor: 'transparent',
            color: theme.color.textColor,
        },
        usernameView: {
            flexDirection: 'row',
            marginRight: 10,
            marginLeft: 5,
        },
    }),
};

export interface MessageProps<TMessage extends IMessage> {
    key: any;
    showUserAvatar?: boolean;
    position: 'left' | 'right';
    currentMessage?: TMessage;
    nextMessage?: TMessage;
    previousMessage?: TMessage;
    user: User;
    inverted?: boolean;
    containerStyle?: LeftRightStyle<ViewStyle>;
    renderBubble?(props: Bubble['props']): React.ReactNode;
    renderDay?(props: DayProps<TMessage>): React.ReactNode;
    renderSystemMessage?(props: SystemMessageProps<TMessage>): React.ReactNode;
    renderAvatar?(props: AvatarProps<TMessage>): React.ReactNode;
    shouldUpdateMessage?(
        props: MessageProps<IAppChatMessage>,
        nextProps: MessageProps<IAppChatMessage>,
    ): boolean;
    onMessageLayout?(event: LayoutChangeEvent): void;
}

export class MyMessage<
    TMessage extends IAppChatMessage,
> extends React.Component<MessageProps<TMessage>> {
    static defaultProps = {
        renderAvatar: undefined,
        renderBubble: null,
        renderDay: null,
        renderSystemMessage: null,
        position: 'left',
        currentMessage: {},
        nextMessage: {},
        previousMessage: {},
        user: {},
        containerStyle: {},
        showUserAvatar: false,
        inverted: true,
        shouldUpdateMessage: undefined,
        onMessageLayout: undefined,
    };

    static propTypes = {
        renderAvatar: PropTypes.func,
        showUserAvatar: PropTypes.bool,
        renderBubble: PropTypes.func,
        renderDay: PropTypes.func,
        renderSystemMessage: PropTypes.func,
        position: PropTypes.oneOf(['left', 'right']),
        currentMessage: PropTypes.object,
        nextMessage: PropTypes.object,
        previousMessage: PropTypes.object,
        user: PropTypes.object,
        inverted: PropTypes.bool,
        containerStyle: PropTypes.shape({
            left: StylePropType,
            right: StylePropType,
        }),
        shouldUpdateMessage: PropTypes.func,
        onMessageLayout: PropTypes.func,
    };

    shouldComponentUpdate(nextProps: MessageProps<TMessage>) {
        const next = nextProps.currentMessage!;
        const current = this.props.currentMessage!;
        const {previousMessage, nextMessage} = this.props;
        const nextPropsMessage = nextProps.nextMessage;
        const nextPropsPreviousMessage = nextProps.previousMessage;

        const shouldUpdate =
            (this.props.shouldUpdateMessage &&
                this.props.shouldUpdateMessage(this.props, nextProps)) ||
            false;

        return (
            next.sent !== current.sent ||
            next.received !== current.received ||
            next.pending !== current.pending ||
            next.createdAt !== current.createdAt ||
            next.text !== current.text ||
            next.image !== current.image ||
            next.video !== current.video ||
            next.audio !== current.audio ||
            next.reactions !== current.reactions ||
            previousMessage !== nextPropsPreviousMessage ||
            nextMessage !== nextPropsMessage ||
            shouldUpdate
        );
    }

    renderDay() {
        if (this.props.currentMessage && this.props.currentMessage.createdAt) {
            const {containerStyle, onMessageLayout, ...props} = this.props;
            if (this.props.renderDay) {
                return this.props.renderDay(props);
            }
            return <Day {...props} />;
        }
        return null;
    }

    renderBubble() {
        const {containerStyle, onMessageLayout, ...props} = this.props;
        if (this.props.renderBubble) {
            return this.props.renderBubble(props);
        }
        // @ts-ignore
        return <CustomBubble {...props} />;
    }

    renderSystemMessage() {
        const {containerStyle, onMessageLayout, ...props} = this.props;

        if (this.props.renderSystemMessage) {
            return this.props.renderSystemMessage(props);
        }
        return <SystemMessage {...props} />;
    }

    renderAvatar() {
        const {user, currentMessage, showUserAvatar} = this.props;

        if (
            user &&
            user._id &&
            currentMessage &&
            currentMessage.user &&
            user._id === currentMessage.user._id &&
            !showUserAvatar
        ) {
            return null;
        }

        if (
            currentMessage &&
            currentMessage.user &&
            currentMessage.user.avatar === null
        ) {
            return null;
        }

        const {containerStyle, onMessageLayout, ...props} = this.props;
        return <Avatar {...props} />;
    }

    renderUsername() {
        const {currentMessage, user, previousMessage} = this.props;
        const shouldShowUserName =
            currentMessage &&
            previousMessage &&
            (!isSameUser(currentMessage, previousMessage) ||
                !isSameDay(currentMessage, previousMessage));
        if (currentMessage && shouldShowUserName) {
            if (user && currentMessage.user._id === user._id) {
                return null;
            }
            return (
                <View style={styles.content.usernameView}>
                    <TextPrimary style={styles.content.username}>
                        {currentMessage.user.name}
                    </TextPrimary>
                </View>
            );
        }
        return null;
    }

    render() {
        const {
            currentMessage,
            onMessageLayout,
            nextMessage,
            position,
            containerStyle,
        } = this.props;
        if (currentMessage) {
            const sameUser = isSameUser(currentMessage, nextMessage!);
            return (
                <View onLayout={onMessageLayout}>
                    {this.renderDay()}
                    {currentMessage.system ? (
                        this.renderSystemMessage()
                    ) : (
                        <View>
                            <View
                                style={[
                                    styles[position].container,
                                    {marginBottom: sameUser ? 2 : 10},
                                    !this.props.inverted && {marginBottom: 2},
                                    containerStyle && containerStyle[position],
                                ]}>
                                {this.props.position === 'left'
                                    ? this.renderAvatar()
                                    : null}
                                <View>
                                    {this.renderUsername()}
                                    {this.renderBubble()}
                                </View>
                                {this.props.position === 'right'
                                    ? this.renderAvatar()
                                    : null}
                            </View>
                        </View>
                    )}
                </View>
            );
        }
        return null;
    }
}
