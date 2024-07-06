import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import SignInScreen from '@modules/auth/signin';
import LanguageScreen from '@modules/languages';
import {StartScreen} from '@modules/start';
import React from 'react';
import DeveloperConsole from '@modules/developerconsole';
import NetworkDebugger from '@modules/developerconsole/debugger/NetworkDebugger';
import {AppStackParamList} from './RouteParams';
import AppTab from './routes/AppTab';
import {SignUpEmailScreen} from '@modules/auth/signup';
import {createDefaultStackNavigationOptions} from './config/header';
import {ConversationScreen} from '@modules/conversation';
import {PdfViewer} from '@modules/pdfviewer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dimensions} from '@theme/Dimensions';
import {Platform, View} from 'react-native';
import {ParticipantList} from '@modules/participants';
import {CommonFilter} from '@modules/commonfilter';
import {IBomPicker} from '@modules/common/IBomPicker';
import {RichTextEditor} from '@components/globals/RichTextEditor';

const Stack = createStackNavigator<AppStackParamList>();

interface IProps {}

// Only use one Stack for further auto testing. React Navigation deeply nested view on ios
export const RootStack = (props: IProps) => {
    const defaultOptions = createDefaultStackNavigationOptions();
    return (
        <Stack.Navigator
            initialRouteName={'SplashScreen'}
            screenOptions={{
                ...defaultOptions,
                presentation: 'card',
                headerMode: 'screen',
                animationTypeForReplace: 'pop',
            }}>
            <Stack.Screen
                name={'SplashScreen'}
                component={StartScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="AppTab"
                component={AppTab}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="SignUpEmail"
                component={SignUpEmailScreen}
                options={{headerShown: true}}
            />
            <Stack.Screen name="Languages" component={LanguageScreen} />
            <Stack.Screen name="Conversation" component={ConversationScreen} />
            <Stack.Screen name="IBomPicker" component={IBomPicker} />
            <Stack.Screen name="RichTextEditor" component={RichTextEditor} />
            <Stack.Screen
                name="ParticipantList"
                component={ParticipantList}
                options={{
                    presentation: 'modal',
                    // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-shadow
                    headerBackImage: props => (
                        <View
                            style={{
                                padding: 4,
                            }}>
                            <Ionicons
                                name={'close'}
                                color={props.tintColor}
                                size={Dimensions.moderateScale(24)}
                            />
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="CommonFilter"
                component={CommonFilter}
                options={{
                    presentation: 'modal',
                    ...Platform.select({
                        ios: TransitionPresets.ModalSlideFromBottomIOS,
                        android: TransitionPresets.ModalTransition,
                    }),
                    // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-shadow
                    headerBackImage: props => (
                        <View
                            style={{
                                padding: 4,
                            }}>
                            <Ionicons
                                name={'close'}
                                color={props.tintColor}
                                size={Dimensions.moderateScale(24)}
                            />
                        </View>
                    ),
                }}
            />
            <Stack.Screen
                name="PdfViewer"
                component={PdfViewer}
                options={{
                    presentation: 'modal',
                    headerShown: true,
                    title: '',
                    // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-shadow
                    headerBackImage: props => (
                        <View
                            style={{
                                padding: 4,
                            }}>
                            <Ionicons
                                name={'close'}
                                color={props.tintColor}
                                size={Dimensions.moderateScale(24)}
                            />
                        </View>
                    ),
                }}
            />
            <Stack.Group screenOptions={defaultOptions}>
                <Stack.Screen
                    name="DeveloperConsole"
                    component={DeveloperConsole}
                />
                <Stack.Screen
                    name="NetworkDebugger"
                    component={NetworkDebugger}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
};

export const createAppRoot = () => {
    return () => <RootStack />;
};
