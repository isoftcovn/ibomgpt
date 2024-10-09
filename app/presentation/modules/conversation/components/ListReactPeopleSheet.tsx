import BottomSheet, {
    BottomSheetFlatList,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import {UserReactionResponse} from '@models/chat/response/UserReactionResponse';
import {theme} from '@theme/index';
import React, {useCallback, useContext, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ConversationContext} from '../context/ConversationContext';
import {ImageRenderer, TextPrimary} from '@components/index';
import {useTranslation} from 'react-i18next';
import {ChatHelper} from 'app/presentation/managers/ChatManager.helper';
import {useSelector} from 'react-redux';
import {selectUserId} from '@redux/selectors/user';

interface ListReactPeopleSheetProps {}

const ListReactPeopleSheet: React.FC<ListReactPeopleSheetProps> = React.memo(
    () => {
        const sheetRef = useRef<BottomSheet | null>(null);
        const [snapPoints, setSnapPoints] = React.useState<any[]>(['50%']);
        const {selectedMessageForReaction, setBottomSheetRef} =
            useContext(ConversationContext);
        const people = selectedMessageForReaction?.reactions || [];
        const {t} = useTranslation();
        const userId = useSelector(selectUserId);

        const onRemoveReaction = useCallback(() => {}, []);

        const renderItem = useCallback(
            ({item, index}: {item: UserReactionResponse; index: number}) => {
                const isMe = userId === item.userId;
                return (
                    <TouchableOpacity
                        style={[
                            styles.personContainer,
                            {
                                borderTopWidth: index === 0 ? 0 : 1,
                                borderTopColor: theme.color.colorSeparator,
                            },
                        ]}
                        activeOpacity={0.8}
                        onPress={isMe ? onRemoveReaction : undefined}>
                        <ImageRenderer
                            style={styles.avatar}
                            resizeMode="cover"
                            source={item.userAvatarUrl}
                        />
                        <View style={{flex: 1}}>
                            <TextPrimary style={styles.personName}>
                                {item.username}
                            </TextPrimary>
                            {isMe && (
                                <TextPrimary style={styles.hintText}>
                                    {t('tapToRemove')}
                                </TextPrimary>
                            )}
                        </View>
                        <TextPrimary style={styles.emoji}>
                            {ChatHelper.shared.mapReactionIdToEmoji(
                                item.reactionId,
                            )}
                        </TextPrimary>
                    </TouchableOpacity>
                );
            },
            [userId, t, onRemoveReaction],
        );

        return (
            <BottomSheet
                ref={ref => {
                    sheetRef.current = ref;
                    setBottomSheetRef(ref);
                }}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                index={-1}>
                <BottomSheetView>
                    <TextPrimary style={styles.title}>
                        {t('reactions')}
                    </TextPrimary>
                    <BottomSheetFlatList
                        data={people}
                        keyExtractor={item => `${item.userId}`}
                        renderItem={renderItem}
                        contentContainerStyle={styles.contentContainer}
                    />
                </BottomSheetView>
            </BottomSheet>
        );
    },
);

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    contentContainer: {
        paddingHorizontal: theme.spacing.large,
        paddingVertical: theme.spacing.small,
    },
    personContainer: {
        paddingVertical: theme.spacing.medium,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: theme.spacing.large,
    },
    personName: {},
    hintText: {
        color: theme.color.labelColor,
        ...theme.textVariants.subtitle1,
        marginTop: theme.spacing.tiny,
    },
    emoji: {
        fontSize: theme.fontSize.fontSizeHuge,
    },
    title: {
        textAlign: 'center',
        ...theme.textVariants.title1,
    },
});

export default ListReactPeopleSheet;
