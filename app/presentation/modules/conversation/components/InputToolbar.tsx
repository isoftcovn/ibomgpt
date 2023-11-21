import { Box } from '@components/globals/view/Box';
import { Dimensions } from '@theme/Dimensions';
import { theme } from '@theme/index';
import { IAppChatMessage } from 'app/presentation/models/chat';
import React, { useContext, useEffect, useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Composer, ComposerProps, InputToolbar, InputToolbarProps, Send, SendProps } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useInputText, useIsInEditMode } from '../hooks/CommonHooks';
import { ConversationContext } from '../context/ConversationContext';

export interface IMyComposerProps extends ComposerProps {
    onSelectFilePressed: () => void;
    onSelectMediaPressed: () => void;
}

export const MyInputToolbar = (props: InputToolbarProps<IAppChatMessage>) => {
    return <InputToolbar
        {...props}
        containerStyle={styles.container}
    />;
};

export const MySend = (props: SendProps<IAppChatMessage>) => {
    const { text, setText } = useInputText();
    const { editMessage, isInEditMode } = useIsInEditMode();
    const { setEditMessage } = useContext(ConversationContext);

    const isEditMessageChanged = useMemo(() => {
        if (editMessage) {
            return text !== editMessage.text;
        }
        return false;
    }, [editMessage, text]);

    if (isInEditMode && !isEditMessageChanged) {
        return <TouchableOpacity
            style={styles.sendContainer}
            onPress={() => {
                setEditMessage(undefined);
                setText('');
            }}
        >
            <Ionicons
                name="close-outline"
                size={Dimensions.moderateScale(24)}
                color={theme.color.textColor}
            />
        </TouchableOpacity>;
    }

    return <Send
        {...props}
        disabled={!text}
        text={text}
        containerStyle={styles.sendContainer}
    >
        <Ionicons
            name="send-sharp"
            size={Dimensions.moderateScale(24)}
            color={theme.color.colorPrimary}
        />
    </Send>;
};

const MyInput = React.memo((props: IMyComposerProps) => {
    const { setText, text } = useInputText();
    const { editMessage } = useIsInEditMode();

    useEffect(() => {
        if (editMessage && editMessage.text) {
            setText(editMessage.text);
        }
    }, [editMessage, setText]);

    return <Composer
        {...props}
        textInputStyle={styles.textInput}
        onTextChanged={setText}
        text={text}
    />;
});

export const MyComposer = (props: IMyComposerProps) => {
    const { onSelectFilePressed, onSelectMediaPressed } = props;
    const { text } = useInputText();
    const { editMessage, isInEditMode } = useIsInEditMode();

    const isEditMessageChanged = useMemo(() => {
        if (editMessage) {
            return text !== editMessage.text;
        }
        return false;
    }, [editMessage, text]);

    return <Box
        style={styles.composerContainer}
        direction="row"
        alignItems="center"
    >
        <MyInput
            {...props}
        />
        {isInEditMode && !isEditMessageChanged ? null : <>
            <TouchableOpacity
                style={styles.composerActionContainer}
                activeOpacity={0.8}
                onPress={onSelectFilePressed}
            >
                <Ionicons
                    name="attach"
                    size={Dimensions.moderateScale(24)}
                    color={theme.color.labelColor}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.composerActionContainer}
                activeOpacity={0.8}
                onPress={onSelectMediaPressed}
            >
                <Ionicons
                    name="images-outline"
                    size={Dimensions.moderateScale(24)}
                    color={theme.color.labelColor}
                />
            </TouchableOpacity>
        </>}
    </Box>;
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.small,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: theme.spacing.small,
        marginTop: 0,
        height: Dimensions.moderateScale(44),
        width: Dimensions.moderateScale(40),
    },
    textInput: {
        ...theme.textVariants.body1,
        marginLeft: theme.spacing.medium,
    },
    composerContainer: {
        flex: 1,
    },
    composerActionContainer: {
        height: Dimensions.moderateScale(44),
        width: Dimensions.moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
    }
});
