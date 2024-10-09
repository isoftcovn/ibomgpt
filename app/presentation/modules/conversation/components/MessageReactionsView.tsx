import {TextPrimary} from '@components/index';
import {theme} from '@theme/index';
import {ChatHelper} from 'app/presentation/managers/ChatManager.helper';
import {IAppChatMessage} from 'app/presentation/models/chat';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

interface MessageReactionsViewProps {
    currentMessage: IAppChatMessage;
    position: string;
    onPress: () => void;
}

const MessageReactionsView: React.FC<MessageReactionsViewProps> = React.memo(
    ({currentMessage, position, onPress}) => {
        const reactions = currentMessage.reactions ?? [];
        const renderedReacttions = reactions.slice(0, 2);
        if (reactions.length === 0) {
            return null;
        }
        return (
            <TouchableOpacity
                style={[
                    styles.container,
                    position === 'left' ? styles.left : styles.right,
                ]}
                onPress={onPress}>
                {renderedReacttions.map(reaction => (
                    <TextPrimary key={reaction.userId} variant="body3">
                        {ChatHelper.shared.mapReactionIdToEmoji(
                            reaction.reactionId,
                        )}
                    </TextPrimary>
                ))}
                <TextPrimary variant="body2">
                    {renderedReacttions.length}
                </TextPrimary>
            </TouchableOpacity>
        );
    },
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.tiny,
        paddingHorizontal: theme.spacing.small,
        backgroundColor: '#fff',
        borderRadius: 60,
        gap: theme.spacing.tiny,
        marginTop: -theme.spacing.tiny,
    },
    left: {},
    right: {},
    reactionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 2,
    },
});

export default MessageReactionsView;
