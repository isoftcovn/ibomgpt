import {ImageRenderer, TextPrimary} from '@components/index';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetFlatList,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import {UserReactionResponse} from '@models/chat/response/UserReactionResponse';
import {selectUserId} from '@redux/selectors/user';
import {theme} from '@theme/index';
import {ChatHelper} from 'app/presentation/managers/ChatManager.helper';
import React, {useCallback, useContext, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {ConversationContext} from '../context/ConversationContext';
import {useContextMenuUndoReactionPressed} from './ContextMMenuModal.hooks';
import {Dimensions} from '@theme/Dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface ListReactPeopleSheetProps {}

const ListReactPeopleSheet: React.FC<ListReactPeopleSheetProps> = React.memo(
    () => {
        const sheetRef = useRef<BottomSheet | null>(null);
        const sheetFlatListRef = useRef<FlatList | null>(null);
        const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
        const [reactions, setReactions] = React.useState<
            UserReactionResponse[][]
        >([]);
        const [snapPoints] = React.useState<any[]>(['50%']);
        const {selectedMessageForReaction, setBottomSheetRef} =
            useContext(ConversationContext);
        const {t} = useTranslation();
        const userId = useSelector(selectUserId);
        const onRemoveReaction = useContextMenuUndoReactionPressed(
            selectedMessageForReaction,
        );
        const insets = useSafeAreaInsets();

        const groupData = useCallback(
            (
                allReactions: UserReactionResponse[],
                ignoreUserId?: number | string,
            ) => {
                const reactionGroups: UserReactionResponse[][] = [];
                allReactions.forEach(reaction => {
                    if (ignoreUserId && reaction.userId === ignoreUserId) {
                        return;
                    }
                    // all group
                    if (!reactionGroups[0]) {
                        reactionGroups[0] = [];
                    }
                    reactionGroups[0].push(reaction);

                    // group by emoji
                    const index = reactionGroups.findIndex(
                        group => group[0].reactionId === reaction.reactionId,
                    );
                    if (index === -1) {
                        reactionGroups[reactionGroups.length] = [reaction];
                    } else if (index !== 0) {
                        reactionGroups[index].push(reaction);
                    }
                });

                return reactionGroups;
            },
            [],
        );

        useEffect(() => {
            const allReactions = selectedMessageForReaction?.reactions ?? [];
            const reactionGroups = groupData(allReactions);
            setReactions(reactionGroups);
        }, [selectedMessageForReaction, groupData]);

        const _onRemoveReaction = useCallback(() => {
            onRemoveReaction();
            setReactions(
                groupData(selectedMessageForReaction?.reactions ?? [], userId),
            );
        }, [
            groupData,
            onRemoveReaction,
            selectedMessageForReaction?.reactions,
            userId,
        ]);

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
                        onPress={isMe ? _onRemoveReaction : undefined}>
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
            [userId, _onRemoveReaction, t],
        );

        const renderGroup = useCallback(
            ({item, index}: {item: UserReactionResponse[]; index: number}) => {
                return (
                    <BottomSheetFlatList
                        style={{
                            width: Dimensions.screenWidth(),
                        }}
                        contentContainerStyle={styles.contentContainer}
                        data={item}
                        renderItem={renderItem}
                    />
                );
            },
            [renderItem],
        );

        const renderFooter = useCallback(() => {
            return (
                <View style={styles.footer}>
                    {reactions.map((group, index) => {
                        return (
                            <TouchableOpacity
                                key={group[0].reactionId}
                                style={[
                                    styles.footerItem,
                                    {
                                        backgroundColor:
                                            index === selectedIndex
                                                ? theme.color.colorSeparator
                                                : 'transparent',
                                    },
                                ]}
                                onPress={() => {
                                    sheetFlatListRef.current?.scrollToIndex({
                                        index,
                                        animated: true,
                                    });
                                    setSelectedIndex(index);
                                }}>
                                <TextPrimary style={styles.footerEmoji}>
                                    {index === 0
                                        ? t('all')
                                        : ChatHelper.shared.mapReactionIdToEmoji(
                                              group[0].reactionId,
                                          )}
                                </TextPrimary>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        }, [reactions, selectedIndex, t]);

        const renderBackdrop = useCallback(
            (props: BottomSheetBackdropProps) => (
                <BottomSheetBackdrop {...props} />
            ),
            [],
        );

        return (
            <BottomSheet
                ref={ref => {
                    sheetRef.current = ref;
                    setBottomSheetRef(ref);
                }}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backdropComponent={renderBackdrop}
                index={-1}>
                <BottomSheetView
                    style={{
                        flex: 1,
                        paddingBottom: insets.bottom + theme.spacing.medium,
                    }}>
                    <BottomSheetFlatList
                        ref={sheetFlatListRef}
                        style={{
                            flex: 1,
                        }}
                        data={reactions}
                        horizontal
                        pagingEnabled
                        onScroll={(evt: any) => {
                            const offsetX = evt.nativeEvent.contentOffset.x;
                            const index = Math.floor(
                                offsetX / Dimensions.screenWidth(),
                            );
                            if (
                                index !== selectedIndex &&
                                offsetX % Dimensions.screenWidth() === 0
                            ) {
                                setSelectedIndex(index);
                            }
                        }}
                        keyExtractor={item => `${item[0].reactionId}`}
                        renderItem={renderGroup}
                    />
                    {renderFooter()}
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
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.small,
        borderRadius: 60,
    },
    footerEmoji: {
        fontSize: theme.fontSize.fontSizeExtraLarge,
    },
});

export default ListReactPeopleSheet;
