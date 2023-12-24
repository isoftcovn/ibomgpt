import { Box } from '@components/globals/view/Box';
import { Dimensions } from '@theme/Dimensions';
import { theme } from '@theme/index';
import { IAppChatMessage } from 'app/presentation/models/chat';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Composer, ComposerProps, InputToolbar, InputToolbarProps, Send, SendProps } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useInputText, useIsInEditMode } from '../hooks/CommonHooks';
import { ConversationContext } from '../context/ConversationContext';
import { selectParticipantsByKey } from '@redux/selectors/conversation';
import { useSelector } from 'react-redux';
import { ChatHelper } from 'app/presentation/managers/ChatManager.helper';
import { selectDisplayName } from '@redux/selectors/user';

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
    const { objectId, objectInstanceId } = useContext(ConversationContext);
    const { setText, text } = useInputText();
    const { editMessage } = useIsInEditMode();
    const key = `${objectId}-${objectInstanceId}`;
    const participants = useSelector(state => selectParticipantsByKey(state, key));
    const userIds = useMemo(() => participants.map(item => `${item.id}`), [participants]);
    const displayName = useSelector(selectDisplayName);

    useEffect(() => {
        if (editMessage && editMessage.text) {
            setText(editMessage.text);
        }
    }, [editMessage, setText]);

    useEffect(() => {
        if (text.length > 0) {
            ChatHelper.shared.sendTypingEvent(userIds, {
                typingState: 'typing',
                userName: displayName,
                objectId,
                objectInstanceId,
            });
        } else {
            ChatHelper.shared.sendTypingEvent(userIds, {
                typingState: 'ended',
                userName: displayName,
                objectId,
                objectInstanceId,
            });
        }
    }, [text, userIds, displayName, objectId, objectInstanceId]);

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
        paddingVertical: theme.spacing.tiny,
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
        color: theme.color.textColor,
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
