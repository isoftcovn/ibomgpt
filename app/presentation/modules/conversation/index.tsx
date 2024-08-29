import {AudioPlayerModal} from '@components/globals/modal/AudioPlayerModal';
import {VideoPlayerModal} from '@components/globals/modal/VideoPlayerModal';
import UserModel from '@models/user/response/UserModel';
import {AppStackParamList} from '@navigation/RouteParams';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
    getMessagesActionTypes,
    updateConversationParticipantsActionTypes,
} from '@redux/actions/conversation';
import {
    selectMessagesByKey,
    selectMessagesCanLoadMoreByKey,
    selectMessagesFetchingState,
    selectParticipantsByKey,
    selectRoomNameByKey,
} from '@redux/selectors/conversation';
import {selectDisplayName, selectProfile} from '@redux/selectors/user';
import {IAppChatMessage} from 'app/presentation/models/chat';
import {theme} from 'app/presentation/theme';
import React, {
    createRef,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {
    ActivityIndicator,
    InteractionManager,
    Platform,
    StyleSheet,
    TextInput,
    View,
    Keyboard,
} from 'react-native';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {MyAudioMessage} from './components/AudioMessage';
import {RenderImageMessage} from './components/ImageMessage';
import {
    IMyComposerProps,
    MyComposer,
    MyInputToolbar,
    MySend,
} from './components/InputToolbar';
import {
    MyAvatar,
    MyBubble,
    MyCustomMessage,
    MyDayMessage,
    MySystemMessage,
    MyTextMessage,
    RenderMessage,
    renderScrollToBottom,
} from './components/MessageComponents';
import {MyVideoMessage} from './components/VideoMessage';
import {
    ConversationContext,
    ConversationInputContext,
} from './context/ConversationContext';
import {
    useMarkAsReadConversation,
    useOnMessageLongPress,
} from './hooks/CommonHooks';
import {
    IPickerAsset,
    useOnMessagePressed,
    usePickDocuments,
    usePickMediaAssets,
} from './hooks/MediaHooks';
import {
    useSendMediaMessage,
    useSendTextMessage,
} from './hooks/SubmitMessageHooks';
import {ChatMessagesRequestModel} from '@models/chat/request/ChatMessagesRequestModel';
import {TypingAnimation} from './components/TypingAninimation';
import {ChatHelper} from 'app/presentation/managers/ChatManager.helper';
import {ChatManager} from 'app/presentation/managers/ChatManager';
import {ConversationHeaderMenu} from './components/HeaderMenu';
import {ChatRoomsOptions} from '@models/chat/response/ChatRoomOptions';
import {ChatRepository} from '@data/repository/chat';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'Conversation'>;
    route: RouteProp<AppStackParamList, 'Conversation'>;
}

export const ConversationScreen = (props: IProps) => {
    const {route} = props;
    const [editMessage, setEditMessage] = useState<IAppChatMessage>();
    const [text, setText] = useState('');
    const [options, setOptions] = useState<ChatRoomsOptions>();
    const textInputRef = createRef<TextInput>();
    const objectId = useMemo(() => {
        return route.params.objectId;
    }, [route.params]);
    const objectInstanceId = useMemo(() => {
        return route.params.objectInstanceId;
    }, [route.params]);
    const dispatch = useDispatch();

    useEffect(() => {
        const repo = new ChatRepository();
        repo.getChatRoomOptions(objectId, objectInstanceId)
            .then(options => {
                setOptions(options);
                const key = `${objectId}-${objectInstanceId}`;
                if (options.participants) {
                    dispatch(
                        updateConversationParticipantsActionTypes.startAction(
                            options.participants,
                            {
                                sectionId: key,
                            },
                        ),
                    );
                }
            })
            .catch(error => {
                //
            });
    }, [objectId, objectInstanceId, dispatch]);

    const enterEditMode = useCallback((message?: IAppChatMessage) => {
        console.info(
            message ? 'Enter edit mode: ' + message.text : 'Exit edit mode',
        );
        setEditMessage(message);
    }, []);

    const contextValue = useMemo(
        () => ({
            setEditMessage: enterEditMode,
            editMessage,
            textInputRef,
            objectId,
            objectInstanceId,
            options,
            setOptions,
        }),
        [
            enterEditMode,
            editMessage,
            textInputRef,
            objectId,
            objectInstanceId,
            options,
        ],
    );

    const inputContextValue = useMemo(
        () => ({
            setText,
            text,
        }),
        [text],
    );

    return (
        <ConversationContext.Provider value={contextValue}>
            <ConversationInputContext.Provider value={inputContextValue}>
                <ConversationContent {...props} />
            </ConversationInputContext.Provider>
        </ConversationContext.Provider>
    );
};

const ConversationContent = React.memo((props: IProps) => {
    const {navigation, route} = props;
    const insets = useSafeAreaInsets();
    const messageContentRef = useRef<string>();
    const didmountRef = useRef(false);
    const [keyboardShown, setKeyboardShown] = useState(false);
    const {textInputRef, editMessage, options} =
        useContext(ConversationContext);
    const {setText} = useContext(ConversationInputContext);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const objectId = useMemo(() => {
        return route.params.objectId;
    }, [route.params]);
    const objectInstanceId = useMemo(() => {
        return route.params.objectInstanceId;
    }, [route.params]);
    const {openPicker} = usePickMediaAssets();
    const {openDocumentsPicker} = usePickDocuments();
    const {sendTextMessage} = useSendTextMessage(objectId, objectInstanceId);
    const {sendMediaMessage} = useSendMediaMessage(objectId, objectInstanceId);
    const {
        onMessagePressed,
        isVideoModalVisible,
        setVideoModalVisible,
        videoUri,
        audioUri,
        isAudioModalVisible,
        setAudioModalVisible,
    } = useOnMessagePressed(navigation);
    const {markAsRead} = useMarkAsReadConversation(objectId, objectInstanceId);
    const key = useMemo(() => {
        return `${objectId}-${objectInstanceId}`;
    }, [objectId, objectInstanceId]);
    const user: UserModel | undefined = useSelector(selectProfile).data;
    const displayName = useSelector(selectDisplayName);
    const participants = useSelector(state =>
        selectParticipantsByKey(state, key),
    );
    const userIds = useMemo(
        () => participants.map(item => `${item.id}`),
        [participants],
    );
    const messages = useSelector(state => selectMessagesByKey(state, key));
    const roomName = useMemo(() => options?.name ?? '', [options]);
    const canLoadMore = useSelector(state =>
        selectMessagesCanLoadMoreByKey(state, key),
    );
    const isFetching = useSelector(selectMessagesFetchingState);
    const {onMessageLongPress} = useOnMessageLongPress(
        objectId,
        objectInstanceId,
    );
    const isLoading = useMemo(
        () => messages.length === 0 && isFetching,
        [isFetching, messages.length],
    );

    const conversationName = useRef<string>();

    console.log('rerender chat main');

    useEffect(() => {
        let name = route.params?.name ?? '';
        if (roomName) {
            name = roomName;
        }
        navigation.setOptions({
            title:
                name || `${t('detail')}:${route.params?.objectInstanceId ?? 0}`,
            headerRight: props => (
                <ConversationHeaderMenu
                    navigation={navigation}
                    route={route}
                    tintColor={props.tintColor}
                    options={options}
                />
            ),
        });

        conversationName.current = name;
    }, [route.params, navigation, route, t, roomName, options]);

    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            () => setKeyboardShown(true),
        );
        const keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            () => setKeyboardShown(false),
        );
        return () => {
            keyboardWillShowListener?.remove();
            keyboardWillHideListener?.remove();
            ChatManager.shared.currentConversationInfo = {
                objectId: 0,
                objectInstanceId: 0,
            };
        };
    }, []);

    useEffect(() => {
        if (!didmountRef.current) {
            InteractionManager.runAfterInteractions(() => {
                const request = new ChatMessagesRequestModel(
                    objectId,
                    objectInstanceId,
                    0,
                );
                dispatch(getMessagesActionTypes.startAction(request));
            });
            didmountRef.current = true;
            ChatManager.shared.currentConversationInfo = {
                objectId,
                objectInstanceId,
            };
        }

        return () => {
            ChatHelper.shared.sendTypingEvent(userIds, {
                typingState: 'ended',
                userName: displayName,
                objectId,
                objectInstanceId,
            });
        };
    }, [dispatch, objectId, objectInstanceId, displayName, userIds]);

    // Mark as read when enter screen
    useEffect(() => {
        markAsRead();
    }, [markAsRead]);

    useEffect(() => {
        if (editMessage) {
            textInputRef.current?.focus();
        }
    }, [editMessage, textInputRef]);

    const onSelectMediaPressed = useCallback(async () => {
        try {
            const assets = await openPicker();
            if (assets.length === 0) {
                return;
            }
            await sendMediaMessage(assets);
            console.info('Media Messages sent.');
        } catch (error) {
            console.error('onSelectMediaPressed error: ', error);
        }
    }, [openPicker, sendMediaMessage]);

    const onSelectFilePressed = useCallback(async () => {
        try {
            const files = await openDocumentsPicker();
            if (files.length === 0) {
                return;
            }
            const convertedAssets: IPickerAsset[] = files.map(item => ({
                name: item.name ?? '',
                uri: item.uri,
                mime: item.type ?? '',
                path: item.uri,
            }));
            await sendMediaMessage(convertedAssets);
            console.info('File Messages sent.');
        } catch (error) {
            console.error('onSelectFilePressed error: ', error);
        }
    }, [openDocumentsPicker, sendMediaMessage]);

    const loadEalierMessages = useCallback(() => {
        if (isFetching || !canLoadMore) {
            return;
        }
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
            const request = new ChatMessagesRequestModel(
                objectId,
                objectInstanceId,
                1,
            );
            request.last_id = Number(lastMessage._id);
            dispatch(getMessagesActionTypes.startAction(request));
        }
    }, [
        canLoadMore,
        isFetching,
        dispatch,
        messages,
        objectId,
        objectInstanceId,
    ]);

    const onSend = useCallback(
        (sentMessages: IMessage[] = []) => {
            sendTextMessage(sentMessages)
                .then(() => {
                    console.info('Text Messages sent.');
                })
                .catch(error => {
                    console.error('Sent text message error: ', error);
                });
            setText('');
        },
        [sendTextMessage, setText],
    );

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const renderComposer = useCallback(
        (props: IMyComposerProps) => {
            return (
                <MyComposer
                    {...props}
                    onSelectMediaPressed={onSelectMediaPressed}
                    onSelectFilePressed={onSelectFilePressed}
                />
            );
        },
        [onSelectMediaPressed, onSelectFilePressed],
    );

    const renderFooter = useCallback(() => {
        return <TypingAnimation />;
    }, []);

    return (
        <View style={[styles.container]}>
            <GiftedChat
                textInputRef={textInputRef}
                messages={messages}
                onSend={onSend}
                user={{
                    _id: user?.id ?? 0,
                    name: user?.fullname ?? '',
                }}
                scrollToBottom
                renderAvatarOnTop
                renderUsernameOnMessage
                showAvatarForEveryMessage={false}
                bottomOffset={Platform.select({
                    ios: insets.bottom > 0 ? 18 : -8,
                    android: undefined,
                })}
                listViewProps={{
                    onEndReached: loadEalierMessages,
                    onEndReachedThreshold: 0.5,
                }}
                lightboxProps={{
                    onLongPress: undefined,
                }}
                messagesContainerStyle={{
                    paddingBottom: keyboardShown ? 0 : theme.spacing.medium,
                }}
                onPress={(context, message) => {
                    onMessagePressed(message);
                }}
                onLongPress={onMessageLongPress}
                keyboardShouldPersistTaps={'never'}
                onInputTextChanged={text => (messageContentRef.current = text)}
                renderInputToolbar={MyInputToolbar}
                renderSend={MySend}
                renderComposer={renderComposer}
                renderAvatar={MyAvatar}
                renderBubble={MyBubble}
                renderMessage={RenderMessage}
                renderMessageText={MyTextMessage}
                renderMessageVideo={MyVideoMessage}
                renderMessageAudio={MyAudioMessage}
                renderMessageImage={RenderImageMessage}
                renderSystemMessage={MySystemMessage}
                renderDay={MyDayMessage}
                renderCustomView={MyCustomMessage}
                scrollToBottomComponent={renderScrollToBottom}
                renderFooter={renderFooter}
            />
            <View
                style={{
                    backgroundColor: '#fff',
                    paddingBottom: insets.bottom,
                }}
            />
            {isLoading ? (
                <View style={styles.viewLoading}>
                    <ActivityIndicator animating size={'large'} />
                </View>
            ) : null}
            <VideoPlayerModal
                videoUri={videoUri ?? ''}
                visible={isVideoModalVisible}
                onBack={() => setVideoModalVisible(false)}
            />
            {isAudioModalVisible && (
                <AudioPlayerModal
                    audioUrl={audioUri ?? ''}
                    onClose={() => setAudioModalVisible(false)}
                />
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e1e8f0',
    },
    viewLoading: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
