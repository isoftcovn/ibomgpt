import {TextPrimary} from '@components/index';
import {ReactionModel} from 'app/presentation/models/ReactionModel';
import {theme} from '@theme/index';
import {ChatHelper} from 'app/presentation/managers/ChatManager.helper';
import {IAppChatMessage} from 'app/presentation/models/chat';
import React, {useCallback, useEffect} from 'react';
import {Image, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import ContextMenuModalHelper from '../helper/ContextMenuModalHelper';
import {
    useContextMenuActionButtonPressed,
    useContextMenuActionButtons,
    useContextMenuReactionPressed,
} from './ContextMMenuModal.hooks';
import {ContextMenuActionButtonModel} from './ContextMenuModal.model';
import {MeasureOnSuccessCallback} from './CustomBubble.model';
import { Dimensions } from '@theme/Dimensions';

interface IProps {}

const CONTEXT_MENU_HEIGHT = 130;
const screenHeight = Dimensions.screenHeight();

const ContextMenuModal: React.FC<IProps> = React.memo(({}) => {
    const [visible, setVisible] = React.useState(false);
    const [message, setMessage] = React.useState<IAppChatMessage>();
    const [viewMeasured, setViewMeasured] =
        React.useState<MeasureOnSuccessCallback>();
    const [reactions, setReactions] = React.useState<ReactionModel[]>(
        ChatHelper.shared.getReactions(),
    );

    const actionButtons = useContextMenuActionButtons(message);
    const onActionButtonPress = useContextMenuActionButtonPressed(message);
    const onReactionPress = useContextMenuReactionPressed(message);

    useEffect(() => {
        const subscription = ContextMenuModalHelper.showModalUpdater.subscribe(
            payload => {
                setVisible(payload.visible ?? false);
                setMessage(payload.message);
                setViewMeasured(payload.viewMeasured);
            },
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const onClose = useCallback(() => {
        setVisible(false);
    }, []);

    const onEmojiButtonPress = useCallback(
        (item: ReactionModel) => {
            onClose();
            onReactionPress(item);
        },
        [onClose, onReactionPress],
    );

    const _onActionButtonPress = useCallback(
        (item: ContextMenuActionButtonModel) => {
            onClose();
            onActionButtonPress(item);
        },
        [onClose, onActionButtonPress],
    );

    const renderEmojiButton = useCallback(
        (item: ReactionModel) => {
            return (
                <TouchableOpacity
                    key={item.id}
                    style={styles.emojiButton}
                    onPress={() => onEmojiButtonPress(item)}>
                    <TextPrimary style={styles.emoji}>{item.value}</TextPrimary>
                </TouchableOpacity>
            );
        },
        [onEmojiButtonPress],
    );

    const renderActionButton = useCallback(
        (item: ContextMenuActionButtonModel) => {
            return (
                <TouchableOpacity
                    key={item.id}
                    style={styles.actionButton}
                    onPress={() => _onActionButtonPress(item)}>
                    <Image
                        style={styles.actionIcon}
                        resizeMode="contain"
                        source={item.icon}
                        tintColor={item.tintColor}
                    />
                    <TextPrimary variant="body2">{item.label}</TextPrimary>
                </TouchableOpacity>
            );
        },
        [_onActionButtonPress],
    );

    const pageY = viewMeasured?.pageY ?? 0;
    const messageHeight = viewMeasured?.height ?? 0;
    let top = pageY + messageHeight + theme.spacing.medium;
    if (top + CONTEXT_MENU_HEIGHT > screenHeight) {
        top = pageY - CONTEXT_MENU_HEIGHT - theme.spacing.medium;
    }

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}>
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}>
                <TouchableOpacity
                    style={[
                        styles.contentContainer,
                        {
                            top: top,
                            right: theme.spacing.small,
                        },
                    ]}
                    activeOpacity={1}
                    onPress={() => {}}
                    onLayout={evt => console.info(evt.nativeEvent.layout)}>
                    <View style={styles.reactionContainer}>
                        {reactions.map(item => renderEmojiButton(item))}
                    </View>
                    <View style={{height: theme.spacing.small}} />
                    <View style={styles.reactionContainer}>
                        {actionButtons.map(item => renderActionButton(item))}
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    contentContainer: {
        position: 'absolute',
        alignItems: 'flex-end',
    },
    reactionContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    emojiButton: {
        padding: theme.spacing.small,
    },
    emoji: {
        fontSize: theme.fontSize.fontSizeGiant,
    },
    actionButton: {
        alignItems: 'center',
        padding: theme.spacing.small,
        gap: theme.spacing.small,
        width: 80,
    },
    actionIcon: {
        width: 24,
        height: 24,
    },
});

export default ContextMenuModal;
