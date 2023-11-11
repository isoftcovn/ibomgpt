import UserModel from '@models/user/response/UserModel';
import { AppStackParamList } from '@navigation/RouteParams';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getMessagesActionTypes } from '@redux/actions/conversation';
import { selectMessagesByKey, selectMessagesCanLoadMoreByKey, selectMessagesFetchingState } from '@redux/selectors/conversation';
import { selectProfile } from '@redux/selectors/user';
import { theme } from 'app/presentation/theme';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { IMyComposerProps, MyComposer, MyInputToolbar, MySend } from './components/InputToolbar';
import { usePickDocuments, usePickMediaAssets } from './hooks/MediaHooks';
import { MyAvatar, MyBubble, MyMessage, MyTextMessage } from './components/MessageComponents';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'Conversation'>;
    route: RouteProp<AppStackParamList, 'Conversation'>;
}

export const ConversationScreen = (props: IProps) => {
    const { navigation, route } = props;
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { assets, openPicker } = usePickMediaAssets();
    const { files, openDocumentsPicker } = usePickDocuments();

    const objectId = useMemo(() => {
        return route.params.objectId;
    }, [route.params]);
    const objectInstanceId = useMemo(() => {
        return route.params.objectInstanceId;
    }, [route.params]);
    const key = useMemo(() => {
        return `${objectId}-${objectInstanceId}`;
    }, [objectId, objectInstanceId]);
    const user: UserModel | undefined = useSelector(selectProfile).data;
    const messages = useSelector(state => selectMessagesByKey(state, key));
    const canLoadMore = useSelector(state => selectMessagesCanLoadMoreByKey(state, key));
    const isFetching = useSelector(selectMessagesFetchingState);

    useEffect(() => {
        const name = route.params?.name ?? '';
        navigation.setOptions({
            title: name || `${t('detail')}:${route.params?.objectInstanceId ?? 0}`
        });
    }, [route.params, navigation, t]);

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            dispatch(getMessagesActionTypes.startAction({
                object_id: objectId,
                object_instance_id: objectInstanceId,
                is_older: 0,
            }));
        });
    }, [dispatch, objectId, objectInstanceId]);

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
            onSelectMediaPressed={openPicker}
            onSelectFilePressed={openDocumentsPicker}
        />;

    }, [openPicker, openDocumentsPicker]);

    const onSend = useCallback((sentMessages: IMessage[] = []) => {
        // setMessages(previousMessages =>
        //     GiftedChat.append(previousMessages, messages),
        // )
    }, []);

    console.log('picked assets: ', assets);
    console.log('picked documents: ', files);

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
            bottomOffset={26}
            listViewProps={{
                onEndReached: loadEalierMessages,
                onEndReachedThreshold: 0.6,
            }}
            messagesContainerStyle={{
                paddingBottom: theme.spacing.huge,
            }}
            renderInputToolbar={MyInputToolbar}
            renderSend={MySend}
            renderComposer={renderComposer}
            renderAvatar={MyAvatar}
            renderBubble={MyBubble}
            renderMessage={MyMessage}
            renderMessageText={MyTextMessage}
        />
        <View
            style={{
                backgroundColor: '#fff',
                paddingBottom: insets.bottom,
            }}
        />
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e1e8f0'
    }
});
