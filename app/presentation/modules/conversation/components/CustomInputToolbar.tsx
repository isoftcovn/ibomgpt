import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, View, ViewStyle } from 'react-native';
import { Actions, Composer, ComposerProps, IMessage, InputToolbarProps, Send, StylePropType } from 'react-native-gifted-chat';
import { TypingAnimation } from './TypingAninimation';

const styles = StyleSheet.create({
    container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#b2b2b2',
        backgroundColor: '#fff',
        bottom: 0,
        left: 0,
        right: 0,
    },
    primary: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    accessory: {
        height: 44,
    },
});

export function CustomInputToolbar<TMessage extends IMessage = IMessage>(
    props: InputToolbarProps<TMessage>,
) {
    const [position, setPosition] = useState('absolute');
    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            () => setPosition('relative'),
        );
        const keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            () => setPosition('absolute'),
        );
        return () => {
            keyboardWillShowListener?.remove();
            keyboardWillHideListener?.remove();
        };
    }, []);

    const { containerStyle, ...rest } = props;
    const {
        renderActions,
        onPressActionButton,
        renderComposer,
        renderSend,
        renderAccessory,
    } = rest;

    return (
        <View style={[styles.container, { position }, containerStyle] as ViewStyle}>
            <View style={{
                alignItems: 'flex-start'
            }}>
                <TypingAnimation />
            </View>
            <View style={[styles.primary, props.primaryStyle]}>
                {renderActions?.(rest) ||
                    (onPressActionButton && <Actions {...rest} />)}
                {renderComposer?.(props as ComposerProps) || <Composer {...props} />}
                {renderSend?.(props) || <Send {...props} />}
            </View>
            {renderAccessory && (
                <View style={[styles.accessory, props.accessoryStyle]}>
                    {renderAccessory(props)}
                </View>
            )}
        </View>
    );
}

CustomInputToolbar.propTypes = {
    renderAccessory: PropTypes.func,
    renderActions: PropTypes.func,
    renderSend: PropTypes.func,
    renderComposer: PropTypes.func,
    onPressActionButton: PropTypes.func,
    containerStyle: StylePropType,
    primaryStyle: StylePropType,
    accessoryStyle: StylePropType,
};
