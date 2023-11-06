import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextPrimary } from 'app/presentation/components';
import { AuthNavigator } from 'app/presentation/navigation/helper/shortcut';
import { logoutActionTypes } from 'app/presentation/redux/actions/auth';
import { theme } from 'app/presentation/theme';
import NotificationHelper from 'app/shared/helper/NotificationHelper';
import React from 'react';
import { DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';

interface IProps {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<any, any>;
    logoutUser: () => void;
}

interface IState {
}

const mapStateToProps = (state: any) => ({});

const actions = {
    logoutUser: logoutActionTypes.startAction,
};

class HomeScreen extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        DeviceEventEmitter.emit('credentialsReadyForAuth');
        NotificationHelper.askPermissionAndRegisterDeviceToken({ onPermission: this.onNotificationPermission },
            { onDeviceTokenReceived: this.onDeviceTokenReceived });
    }

    onNotificationPermission = (granted: boolean) => {
        if (granted) {
            NotificationHelper.listenOnNotification(NotificationHelper.notificationHandler);
        }
    };

    onDeviceTokenReceived = (deviceToken: string) => {
        console.info('device token: ', deviceToken);
    };

    render() {
        return (
            <ExtendedView showsVerticalScrollIndicator={false} bounces={false}>
                <LanguageText style={theme.textVariants.body1}>Home screen</LanguageText>

                <TouchableOpacity onPress={() => {
                    this.props.logoutUser();
                    this.props.navigation.dispatch(AuthNavigator);
                }}>
                    <TextPrimary>Log out</TextPrimary>
                </TouchableOpacity>
            </ExtendedView>
        );
    }
}

export default connect(mapStateToProps, actions)(HomeScreen);

const ExtendedView = styled.ScrollView`
        flex: 1;
        backgroundColor: purple;
    `;

const LanguageText = styled(TextPrimary)`
    marginLeft: ${theme.spacing.medium}px;
    flex: 1;
`;
