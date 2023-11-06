import { theme } from 'app/presentation/theme';
import React from 'react';
import { StyleSheet, TextStyle, ViewStyle, TouchableOpacity } from 'react-native';
import { Button, ButtonProps } from 'react-native-elements';

type ButtonType = keyof typeof theme.buttonVariants;
interface IProps extends ButtonProps {
    buttonType?: ButtonType;
}

const getButtonStyle = (buttonType: ButtonType): ViewStyle => {
    switch (buttonType) {
        case 'filled': return styles.defaultButton;
        case 'outline': return styles.outlinedButton;
        case 'transparent': return styles.transparentButton;
    }
};

const getButtonTitleStyle = (buttonType: ButtonType): TextStyle => {
    switch (buttonType) {
        case 'filled': return styles.defaultTitle;
        case 'outline': return styles.outlineTitle;
        case 'transparent': return styles.transparentTitle;
    }
};

const TextButton = React.memo((props: IProps) => {
    const { buttonStyle, titleStyle, containerStyle, buttonType = 'filled', ...rest } = props;

    return (
        <Button
            containerStyle={[styles.defaultButtonContainer, containerStyle]}
            buttonStyle={[getButtonStyle(buttonType), buttonStyle]}
            titleStyle={[getButtonTitleStyle(buttonType), titleStyle]}
            activeOpacity={0.8}
            TouchableComponent={TouchableOpacity}
            {...rest} />
    );
});

const styles = StyleSheet.create({
    defaultButton: theme.buttonVariants.filled.button,
    defaultTitle: theme.buttonVariants.filled.text,
    defaultButtonContainer: {
    },
    transparentButton: theme.buttonVariants.transparent.button,
    transparentTitle: theme.buttonVariants.transparent.text,
    outlinedButton: theme.buttonVariants.outline.button,
    outlineTitle: theme.buttonVariants.outline.text,
});

export default TextButton;
