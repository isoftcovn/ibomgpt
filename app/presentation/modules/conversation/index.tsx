import { AudioPlayerModal } from '@components/globals/modal/AudioPlayerModal';
import { VideoPlayerModal } from '@components/globals/modal/VideoPlayerModal';
import UserModel from '@models/user/response/UserModel';
import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getMessagesActionTypes } from '@redux/actions/conversation';
import { selectMessagesByKey, selectMessagesCanLoadMoreByKey, selectMessagesFetchingState } from '@redux/selectors/conversation';
import { selectProfile } from '@redux/selectors/user';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { theme } from 'app/presentation/theme';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { MyAudioMessage } from './components/AudioMessage';
import { RenderImageMessage } from './components/ImageMessage';
import { IMyComposerProps, MyComposer, MyInputToolbar, MySend } from './components/InputToolbar';
import { MyAvatar, MyBubble, MyCustomMessage, MyMessage, MySystemMessage, MyTextMessage } from './components/MessageComponents';
import { MyVideoMessage } from './components/VideoMessage';
import { ConversationContext, ConversationInputContext } from './context/ConversationContext';
import { useOnMessageLongPress } from './hooks/CommonHooks';
import { IPickerAsset, useOnMessagePressed, usePickDocuments, usePickMediaAssets } from './hooks/MediaHooks';
import { useSendMediaMessage, useSendTextMessage } from './hooks/SubmitMessageHooks';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'Conversation'>;
    route: RouteProp<AppStackParamList, 'Conversation'>;
}

export const ConversationScreen = (props: IProps) => {
    const [editMessage, setEditMessage] = useState<IAppChatMessage>();
    const [text, setText] = useState('');

    const enterEditMode = useCallback((message?: IAppChatMessage) => {
        setEditMessage(message);
    }, []);

    const contextValue = useMemo(() => ({
        setEditMessage: enterEditMode,
        editMessage
    }), [enterEditMode, editMessage]);

    const inputContextValue = useMemo(() => ({
        setText,
        text
    }), [text]);

    return <ConversationContext.Provider value={contextValue}>
        <ConversationInputContext.Provider value={inputContextValue}>
            <ConversationContent {...props} />
        </ConversationInputContext.Provider>
    </ConversationContext.Provider>;
}

const ConversationContent = React.memo((props: IProps) => {
    const { navigation, route } = props;
    const insets = useSafeAreaInsets();
    const messageContentRef = useRef<string>();
    const didmountRef = useRef(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { openPicker } = usePickMediaAssets();
    const { openDocumentsPicker } = usePickDocuments();
    const { sendTextMessage } = useSendTextMessage();
    const { sendMediaMessage } = useSendMediaMessage();
    const { onMessagePressed, isVideoModalVisible, setVideoModalVisible, videoUri,
        audioUri, isAudioModalVisible, setAudioModalVisible } = useOnMessagePressed(navigation);

    const objectId = useMemo(() => { return route.params.objectId; }, [route.params]);
    const objectInstanceId = useMemo(() => { return route.params.objectInstanceId; }, [route.params]);
    const key = useMemo(() => { return `${objectId}-${objectInstanceId}`; }, [objectId, objectInstanceId]);
    const user: UserModel | undefined = useSelector(selectProfile).data;
    const messages = useSelector(state => selectMessagesByKey(state, key));
    const canLoadMore = useSelector(state => selectMessagesCanLoadMoreByKey(state, key));
    const isFetching = useSelector(selectMessagesFetchingState);
    const { onMessageLongPress } = useOnMessageLongPress(objectId, objectInstanceId);

    console.log('rerender');

    useEffect(() => {
        const name = route.params?.name ?? '';
        navigation.setOptions({
            title: name || `${t('detail')}:${route.params?.objectInstanceId ?? 0}`
        });
    }, [route.params, navigation, t]);

    useEffect(() => {
        if (!didmountRef.current) {
            InteractionManager.runAfterInteractions(() => {
                dispatch(getMessagesActionTypes.startAction({
                    object_id: objectId,
                    object_instance_id: objectInstanceId,
                    is_older: 0,
                }));
            });
            didmountRef.current = true;
        }
    }, [dispatch, objectId, objectInstanceId]);

    const onSelectMediaPressed = useCallback(async () => {
        try {
            const assets = await openPicker();
            if (assets.length === 0) { return; }
            await sendMediaMessage(assets, objectInstanceId, objectId);
            console.info('Media Messages sent.');
        } catch (error) {
            console.error('onSelectMediaPressed error: ', error);
        }
    }, [openPicker, sendMediaMessage, objectInstanceId, objectId]);

    const onSelectFilePressed = useCallback(async () => {
        try {
            const files = await openDocumentsPicker();
            if (files.length === 0) { return; }
            const convertedAssets: IPickerAsset[] = files.map(item => ({
                name: item.name ?? '',
                uri: item.uri,
                mime: item.type ?? '',
                path: item.uri,
            }));
            await sendMediaMessage(convertedAssets, objectInstanceId, objectId);
            console.info('File Messages sent.');
        } catch (error) {
            console.error('onSelectFilePressed error: ', error);
        }
    }, [openDocumentsPicker, sendMediaMessage, objectInstanceId, objectId]);

    const loadEalierMessages = useCallback(() => {
        if (isFetching || !canLoadMore) {
            return;
        }
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
            dispatch(getMessagesActionTypes.startAction({
                object_id: objectId,
                object_instance_id: objectInstanceId,
                is_older: 1,
                last_id: Number(lastMessage._id),
            }));
        }
    }, [canLoadMore, isFetching, dispatch, messages, objectId, objectInstanceId]);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const renderComposer = useCallback((props: IMyComposerProps) => {
        return <MyComposer
            {...props}
            onSelectMediaPressed={onSelectMediaPressed}
            onSelectFilePressed={onSelectFilePressed}
        />;

    }, [onSelectMediaPressed, onSelectFilePressed]);

    const onSend = useCallback((sentMessages: IMessage[] = []) => {
        sendTextMessage(sentMessages, objectInstanceId, objectId).then(() => {
            console.info('Text Messages sent.');
        }).catch(error => {
            console.error('Sent text message error: ', error);
        });
    }, [sendTextMessage, objectId, objectInstanceId]);

    return <View style={[styles.container]}>
        <GiftedChat
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
            // bottomOffset={50}
            listViewProps={{
                onEndReached: loadEalierMessages,
                onEndReachedThreshold: 0.6,
            }}
            lightboxProps={{
                onLongPress: undefined
            }}
            messagesContainerStyle={{
                paddingBottom: theme.spacing.huge,
            }}
            onPress={(context, message) => {
                onMessagePressed(message);
            }}
            onLongPress={onMessageLongPress}
            keyboardShouldPersistTaps={'never'}
            onInputTextChanged={text => messageContentRef.current = text}
            renderInputToolbar={MyInputToolbar}
            renderSend={MySend}
            renderComposer={renderComposer}
            renderAvatar={MyAvatar}
            renderBubble={MyBubble}
            renderMessage={MyMessage}
            renderMessageText={MyTextMessage}
            renderMessageVideo={MyVideoMessage}
            renderMessageAudio={MyAudioMessage}
            renderMessageImage={RenderImageMessage}
            renderSystemMessage={MySystemMessage}
            renderCustomView={MyCustomMessage}
        />
        <View
            style={{
                backgroundColor: '#fff',
                paddingBottom: insets.bottom,
            }}
        />
        <VideoPlayerModal
            videoUri={videoUri ?? ''}
            visible={isVideoModalVisible}
            onBack={() => setVideoModalVisible(false)}
        />
        {isAudioModalVisible && <AudioPlayerModal
            audioUrl={audioUri ?? ''}
            onClose={() => setAudioModalVisible(false)}
        />}
    </View>;
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e1e8f0'
    }
});
