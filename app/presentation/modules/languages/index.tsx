import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import GeneratedImages from 'app/assets/GeneratedImages';
import { TextPrimary } from 'app/presentation/components';
import { theme } from 'app/presentation/theme';
import { LOCALE } from 'app/shared/constants';
import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getString } from '../../localization';
import { changeLanguageTypes } from '../../redux/actions/general';

interface IProps {
    navigation: StackNavigationProp<any, any>;
    route: RouteProp<any, any>;
    changeLanguage: (locale: string) => void;
}

interface IState {
    data: any;
    locale?: string;
}

const mapStateToProps = (state: any) => ({});

const actions = {
    changeLanguage: changeLanguageTypes.startAction,
};

class Languages extends React.Component<IProps, IState> {
    static navigationOptions = ({ navigation }: { navigation: StackNavigationProp<any, any> }) => {
        return {
            headerTitle: 'Languages',
        };
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            data: [
                { id: 1, name: getString('english'), locale: 'en', icon: GeneratedImages.en },
                { id: 2, name: getString('korean'), locale: 'ko_KR', icon: GeneratedImages.korean },
            ],
        };
    }

    componentDidMount() {
        AsyncStorage.getItem(LOCALE).then(locale => {
            if (locale) {
                this.setState({ locale });
            } else {
                this.setState({ locale: 'en' });
            }
        });
    }

    onChange = (data: any) => {
        const { locale } = this.state;
        const alert = getString('alertChangeLanguage');
        let alertTitle = '';
        if (locale === 'en') {
            alertTitle = `${alert} ${data.name}?`;
        } else if (locale === 'ko_KR') {
            alertTitle = `${data.name}${alert}?`;
        }
        Alert.alert(
            '',
            alertTitle,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm', onPress: async () => {
                        this.props.changeLanguage(data.locale);
                        const onChange = this.props.route.params?.onChange;
                        if (onChange) {
                            onChange(data.locale);
                        }
                        this.props.navigation.goBack();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    renderItems = (data: any, index: number) => {
        const { locale } = this.state;
        return (
            <Button key={String(index)} onPress={() => this.onChange(data)}
                disabled={locale === data.locale}>
                <Icon source={data.icon} resizeMode="cover" />
                <LanguageText style={theme.textVariants.body1}>
                    {data.name}
                </LanguageText>
                {locale === data.locale ? <Entypo color={'green'} size={28} name={'check'} /> : null}
            </Button>
        );
    };

    render() {
        const data = this.state.data;
        return (
            <ExtendedView>
                {data.map((v: any, i: number) => (
                    this.renderItems(v, i)
                ))}
            </ExtendedView>
        );
    }
}

// @ts-ignore
export default connect(mapStateToProps, actions)(Languages);

const ExtendedView = styled.View`
        flex: 1;
    `;

const Button = styled.TouchableOpacity`
    flexDirection: row;
    paddingLeft: ${theme.spacing.small}px;
    paddingVertical: ${theme.spacing.medium}px;
    borderBottomWidth: 0.5;
    borderColor: #cecece;
    alignItems: center;
    paddingRight: ${theme.spacing.medium}px;
`;

const Icon = styled.Image`
    height: 35px;
    width: 35px;
    borderWidth: ${StyleSheet.hairlineWidth}px;
    borderColor: #cecece;
    borderRadius: 20;
`;

const LanguageText = styled(TextPrimary)`
    marginLeft: ${theme.spacing.medium}px;
    flex: 1
`;
