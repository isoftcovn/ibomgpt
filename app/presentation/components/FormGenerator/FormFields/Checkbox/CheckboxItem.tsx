import TextPrimary from '@components/globals/text/TextPrimary';
import { theme } from '@theme/index';
import React from 'react';
import {
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface IProps {
    selected: boolean;
    title: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}

export const CheckboxItem = React.memo((props: IProps) => {
    const {onPress, selected, title, style} = props;
    return (
        <TouchableOpacity
            style={[styles.container, style]}
            activeOpacity={0.8}
            onPress={onPress}>
            <View style={styles.iconContainer}>
                <FontAwesome
                    name={selected ? 'check-square-o' : 'square-o'}
                    size={24}
                    color={selected ? theme.color.colorPrimary : '#000'}
                />
            </View>
            <TextPrimary
                style={[
                    styles.title,
                    {
                        color: selected
                            ? theme.color.colorPrimary
                            : '#000',
                    },
                ]}>
                {title}
            </TextPrimary>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    iconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...theme.textVariants.body1,
        color: '#000',
        marginLeft: 4,
        marginTop: 3,
        // flex: 1,
    },
});
