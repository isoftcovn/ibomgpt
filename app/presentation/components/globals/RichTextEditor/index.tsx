import {AppStackParamList} from '@navigation/RouteParams';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FontNames} from '@theme/ThemeDefault';
import {theme} from '@theme/index';
import React, {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IProps {
    navigation: StackNavigationProp<AppStackParamList, 'RichTextEditor'>;
    route: RouteProp<AppStackParamList, 'RichTextEditor'>;
}

export const RichTextEditor = (props: IProps) => {
    const {navigation, route} = props;
    const richText = useRef<RichEditor | undefined>();
    const htmlText = useRef<string>(route.params.html ?? '');
    const insets = useSafeAreaInsets();

    const {t} = useTranslation();

    useEffect(() => {
        navigation.setOptions({
            title: t('rich_text_editor'),
            headerRight: () => {
                return (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        hitSlop={{
                            top: 10,
                            right: 10,
                            bottom: 10,
                            left: 10,
                        }}
                        onPress={() => {
                            route.params.onDone?.(htmlText.current);
                            navigation.goBack();
                        }}>
                        <Ionicons
                            name={'checkmark-done-sharp'}
                            size={24}
                            color={'#fff'}
                        />
                    </TouchableOpacity>
                );
            },
        });
    }, [navigation, route, t]);

    return (
        <View
            style={[
                styles.container,
                {
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
                },
            ]}>
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 20,
                }}>
                <ScrollView
                    contentContainerStyle={{
                        paddingTop: 12,
                    }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{flex: 1}}>
                        <RichEditor
                            ref={(ref: any) => (richText.current = ref)}
                            initialContentHTML={htmlText.current}
                            onChange={html => {
                                htmlText.current = html;
                            }}
                        />
                        <RichToolbar
                            editor={richText}
                            actions={[
                                actions.setBold,
                                actions.setItalic,
                                actions.setUnderline,
                                actions.fontSize,
                                actions.setTextColor,
                                actions.insertBulletsList,
                                actions.insertLink,
                                actions.alignCenter,
                                actions.alignLeft,
                                actions.alignRight,
                            ]}
                        />
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    submitButton: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginTop: 20,
        backgroundColor: theme.color.colorPrimary,
    },
    submitText: {
        ...theme.textVariants.body1,
        fontWeight: '600',
        fontFamily: FontNames.Bold,
        color: '#fff',
    },
});
