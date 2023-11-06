import { theme } from 'app/presentation/theme';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, TextInput } from 'react-native';
import { Input as InputElement, InputProps } from 'react-native-elements';

export interface IProps extends InputProps {
    iconWidth?: number;
    iconHeight?: number;
    iconSource?: ImageSourcePropType;
    getRef?: (ref: TextInput | null) => void;
}

const Input = React.memo((props: IProps) => {
    const {
        inputStyle, inputContainerStyle, iconSource,
        iconHeight, iconWidth, containerStyle, errorMessage, getRef, ...rest
    } = props;

    return (
        <InputElement
            underlineColorAndroid={'transparent'}
            inputStyle={[styles.input, inputStyle]}
            inputContainerStyle={[styles.inputContainer, inputContainerStyle]}
            containerStyle={[styles.container, containerStyle]}
            placeholderTextColor={theme.color.labelColor}
            labelStyle={styles.label}
            errorStyle={styles.error}
            errorMessage={errorMessage}
            // @ts-ignore
            leftIcon={iconSource ? <Image
                style={{
                    width: iconWidth ?? 24,
                    height: iconHeight ?? 24,
                    marginRight: theme.spacing.small,
                }}
                resizeMode={'contain'}
                source={iconSource} /> : undefined
            }
            ref={ref => getRef?.(ref)}
            {...rest}
        />
    );
})

const styles = StyleSheet.create({
    textOnly: {
        paddingVertical: theme.spacing.small,
        flex: 1,
    },
    input: theme.textVariants.body1,
    inputContainer: {
        backgroundColor: theme.color.inputBackgroundColor,
        paddingHorizontal: theme.spacing.medium,
        borderBottomWidth: 0,
        borderRadius: 8,
    },
    container: {
        paddingHorizontal: 0,
    },
    label: {
        color: theme.color.labelColor,
        fontWeight: '400',
    },
    error: {
        color: theme.color.danger,
    },
});

export default Input;