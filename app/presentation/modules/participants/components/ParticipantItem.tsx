import { TextPrimary } from '@components/index';
import UserModel from '@models/user/response/UserModel';
import { theme } from '@theme/index';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface IProps {
    item: UserModel;
    index: number;
    onPress: () => void;
}

export const ParticipantItemView = React.memo((props: IProps) => {
    const { item, onPress } = props;

    return <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={onPress}
    >
        <TextPrimary style={styles.title}>{`${item.code ?? ''} - ${item.fullname ?? ''}`}</TextPrimary>
        <TextPrimary>{`${item.email ?? ''}`}</TextPrimary>
        <TextPrimary>{`${item.position ?? ''} - ${item.department ?? ''}`}</TextPrimary>
    </TouchableOpacity>;
});

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.medium,
    },
    title: {
        fontWeight: '600'
    }
});
