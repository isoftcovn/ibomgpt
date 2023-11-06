import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextPrimary } from 'app/presentation/components';
import { AuthNavigator } from 'app/presentation/navigation/helper/shortcut';
import { logoutActionTypes } from 'app/presentation/redux/actions/auth';
import { theme } from 'app/presentation/theme';
import React from 'react';
import { TouchableOpacity } from 'react-native';
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

class Home2Screen extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <ExtendedView showsVerticalScrollIndicator={false} bounces={false}>
                <LanguageText style={theme.textVariants.body1}>Home screen 2</LanguageText>
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

export default connect(mapStateToProps, actions)(Home2Screen);

const ExtendedView = styled.ScrollView`
        flex: 1;
        backgroundColor: blue;
    `;

const LanguageText = styled(TextPrimary)`
    marginLeft: ${theme.spacing.medium}px;
    flex: 1;
`;
