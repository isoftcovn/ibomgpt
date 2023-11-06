import { theme } from 'app/presentation/theme';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { Input as InputElement, InputProps } from 'react-native-elements';

export interface IProps extends InputProps {
    iconWidth?: number;
    iconHeight?: number;
    iconSource?: ImageSourcePropType;
}

interface IState {
}

export default class Input extends React.PureComponent<IProps, IState> {
    _input?: any;

    static defaultProps = {};

    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    focus = () => {
        if (this._input) {
            this._input.focus();
        }
    };

    setText = (text: string) => {
        if (this._input) {
            this._input.setNativeProps({
                text: text,
            });
        }
    };

    render() {
        const {
            inputStyle, inputContainerStyle, iconSource,
            iconHeight, iconWidth, containerStyle, errorMessage, ...rest
        } = this.props;

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
                    source={iconSource} /> : undefined}
                {...rest}
                ref={(ref: any) => this._input = ref}
            />
        );
    }
}

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
    },
    container: {
    },
    label: {
        color: theme.color.labelColor,
        fontWeight: '400',
    },
    error: {
        color: theme.color.danger,
    },
});
