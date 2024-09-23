import {ChatRoomsOptions} from '@models/chat/response/ChatRoomOptions';
import {AppStackParamList} from '@navigation/RouteParams';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {theme} from '@theme/index';
import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Menu} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinkingHelper from '@shared/helper/LinkingHelper';
import {UserRepository} from '@data/repository/user';
import {DEEPLINK_OBJECT_TYPE} from '@shared/constants';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'Conversation'>;
    route: RouteProp<AppStackParamList, 'Conversation'>;
    tintColor?: string;
    options?: ChatRoomsOptions;
}

export const ConversationHeaderMenu = React.memo((props: IProps) => {
    const {tintColor, navigation, route, options} = props;
    const [visible, setVisible] = useState(false);
    const objectId = useMemo(() => {
        return route.params.objectId;
    }, [route.params]);
    const objectInstanceId = useMemo(() => {
        return route.params.objectInstanceId;
    }, [route.params]);

    const {t} = useTranslation();

    const closeMenu = useCallback(() => {
        setVisible(false);
    }, []);

    const openMenu = useCallback(() => {
        setVisible(true);
    }, []);

    const onOpenProApp = useCallback(() => {
        LinkingHelper.openIBomProAppDetailObject(
            new UserRepository(),
            objectId,
            objectInstanceId,
        );
    }, [objectId, objectInstanceId]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{
                    minWidth: 20,
                }}
                hitSlop={{
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10,
                }}
                onPress={onOpenProApp}>
                <Ionicons name="document" size={24} color={tintColor} />
            </TouchableOpacity>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableOpacity
                        style={{
                            minWidth: 20,
                        }}
                        onPress={openMenu}
                        hitSlop={{
                            top: 10,
                            right: 10,
                            bottom: 10,
                            left: 10,
                        }}>
                        <MaterialCommunityIcons
                            name="dots-vertical"
                            size={24}
                            color={tintColor}
                        />
                    </TouchableOpacity>
                }>
                <Menu.Item
                    onPress={() => {
                        closeMenu();
                        navigation.navigate('ParticipantList', {
                            objectId,
                            objectInstanceId,
                            info: options,
                        });
                    }}
                    title={t('info2')}
                />
                <Menu.Item
                    onPress={() => {
                        closeMenu();
                        navigation.popToTop();
                    }}
                    title={t('groupList')}
                />
            </Menu>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.small,
    },
});
