import { theme } from 'app/presentation/theme';
import React from 'react';
import { Text, TextProps } from 'react-native';

interface IProps extends TextProps {
    children?: any | any[];
    variant?: keyof typeof theme.textVariants;
    color?: keyof typeof theme.color;
}

const TextPrimary = React.memo((props: IProps) => {
    const { children, variant = 'body1', color = theme.color.textColor, style, ...rest } = props;
    return <Text style={[theme.textVariants[variant], { color }, style]} {...rest}>{children}</Text>;
});


export default TextPrimary;
