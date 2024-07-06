import TextPrimary from '@components/globals/text/TextPrimary';
import { theme } from '@theme/index';
import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface IProps {
    title: string;
    selected: boolean;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}

export const RadioButton = React.memo((props: IProps) => {
    const { onPress, selected, title, style } = props;
    return (
        <TouchableOpacity style={[styles.container, style]} activeOpacity={0.8} onPress={onPress}>
            <MaterialIcons
                name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
                color={'#000'}
                size={24}
            />
            <TextPrimary style={styles.text}>{title}</TextPrimary>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    text: {
        ...theme.textVariants.body1,
        marginLeft: 4,
        alignSelf: 'center',
    },
});
