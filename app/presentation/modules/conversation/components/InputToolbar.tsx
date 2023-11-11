import { Box } from '@components/globals/view/Box';
import { Dimensions } from '@theme/Dimensions';
import { theme } from '@theme/index';
import { IAppChatMessage } from 'app/presentation/models/chat';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { InputToolbar, Actions, Composer, Send, InputToolbarProps, SendProps, ComposerProps, ActionsProps } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    return <Send
        {...props}
        disabled={!props.text}
        containerStyle={styles.sendContainer}
    >
        <Ionicons
            name="send-sharp"
            size={Dimensions.moderateScale(24)}
            color={theme.color.colorPrimary}
        />
    </Send>;
};

export const MyComposer = (props: IMyComposerProps) => {
    const {onSelectFilePressed, onSelectMediaPressed} = props;
    return <Box
        style={styles.composerContainer}
        direction="row"
        alignItems="center"
    >
        <Composer
            {...props}
            textInputStyle={styles.textInput}
        />
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
